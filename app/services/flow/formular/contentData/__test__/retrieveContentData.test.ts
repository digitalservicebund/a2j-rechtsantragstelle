import {
  fetchFlowPage,
  fetchMeta,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import {
  buildCmsContentAndTranslations,
  type CMSContent,
} from "../../buildCmsContentAndTranslations";
import { retrieveContentData } from "../retrieveContentData";

const mockPathname = "/fluggastrechte/formular/intro/start";
const mockParams = { "*": "intro/start" };
const mockUserDataWithPageData = {
  name: "name",
  pageData: { arrayIndexes: [] },
};
const mockMigrationData = undefined;

const mockFormPageContent = {
  heading: "new heading",
  pre_form: [],
  post_form: [],
  form: [],
  pageMeta: {
    title: "title",
    description: null,
    ogTitle: null,
    breadcrumb: null,
  },
  preHeading: null,
  nextButtonLabel: null,
  backButtonLabel: null,
  flow_ids: [{ flowId: "/fluggastrechte/formular" }],
  locale: "de",
  stepId: "/intro/start",
} satisfies StrapiFormFlowPage;

const mockTranslations = {
  "/fluggastrechte/formular": {},
  "/fluggastrechte/formular/menu": {},
  "/fluggastrechte/formular/summaryPage": {},
};

vi.mock("~/services/cms/index.server");
vi.mock("~/services/flow/formular/buildCmsContentAndTranslations");

const mockFetchData = () => {
  vi.mocked(fetchFlowPage).mockResolvedValue(mockFormPageContent);
  vi.mocked(fetchMeta);
  vi.mocked(fetchMultipleTranslations).mockResolvedValue(mockTranslations);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("retrieveContentData", () => {
  it("should call once flow page, parent meta and translations", async () => {
    mockFetchData();
    vi.mocked(buildCmsContentAndTranslations).mockResolvedValue({
      cmsContent: {} as unknown as CMSContent,
      translations: {},
    });

    await retrieveContentData(
      mockPathname,
      mockParams,
      mockUserDataWithPageData,
      mockMigrationData,
    );

    expect(fetchFlowPage).toBeCalledTimes(1);
    expect(fetchFlowPage).toHaveBeenCalledWith(
      "form-flow-pages",
      "/fluggastrechte/formular",
      "/intro/start",
    );
    expect(fetchMeta).toBeCalledTimes(1);
    expect(fetchMultipleTranslations).toBeCalledTimes(1);
    expect(fetchMultipleTranslations).toHaveBeenCalledWith([
      "/fluggastrechte/formular/menu",
      "/fluggastrechte/formular",
      `/fluggastrechte/formular/summaryPage`,
    ]);
  });

  it("should call once buildCmsContentAndTranslations and return correctly content data functions", async () => {
    mockFetchData();
    vi.mocked(buildCmsContentAndTranslations).mockResolvedValue({
      cmsContent: { content: "someContent " } as unknown as CMSContent,
      translations: { translation: "someTranslation" },
    });

    const actual = await retrieveContentData(
      mockPathname,
      mockParams,
      mockUserDataWithPageData,
      mockMigrationData,
    );

    expect(buildCmsContentAndTranslations).toBeCalledTimes(1);
    expect(actual.getTranslations()).toEqual({
      translation: "someTranslation",
    });
    expect(actual.getCMSContent()).toEqual({
      content: "someContent ",
    });
  });
});

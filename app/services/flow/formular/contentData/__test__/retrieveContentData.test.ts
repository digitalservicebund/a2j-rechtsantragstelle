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
  startAirport: "BER",
  pageData: { arrayIndexes: [] },
};

const mockFormPageContent = {
  heading: "new heading",
  pre_form: [],
  post_form: [],
  form: [],
  pageMeta: { title: "title" },
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
  mockFetchData();
  vi.mocked(buildCmsContentAndTranslations).mockReturnValue({
    cmsContent: { content: "someContent " } as unknown as CMSContent,
    translations: { translation: "someTranslation" },
    meta: {
      description: "meta description",
      ogTitle: "meta ogTitle",
      breadcrumb: "meta breadcrumb",
      title: "meta title",
    },
  });

  it("should call once flow page, parent meta and translations", async () => {
    await retrieveContentData(
      mockPathname,
      mockParams,
      mockUserDataWithPageData,
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

  it("should call buildCmsContentAndTranslations with replacements and return content data functions", async () => {
    const actual = await retrieveContentData(
      mockPathname,
      mockParams,
      mockUserDataWithPageData,
    );

    expect(buildCmsContentAndTranslations).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        replacements: expect.objectContaining({
          startAirport: "Berlin Brandenburg Flughafen (BER)",
        }),
      }),
    );

    expect(actual.getTranslations()).toEqual({
      translation: "someTranslation",
    });
    expect(actual.getCMSContent()).toEqual({
      content: "someContent ",
    });
  });

  it("should call buildCmsContentAndTranslations with migrationData", async () => {
    await retrieveContentData(
      mockPathname,
      mockParams,
      mockUserDataWithPageData,
      { startAirport: "FRA" },
    );

    expect(buildCmsContentAndTranslations).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        replacements: expect.objectContaining({
          startAirport: "Frankfurt Flughafen (FRA)",
        }),
      }),
    );
  });
});

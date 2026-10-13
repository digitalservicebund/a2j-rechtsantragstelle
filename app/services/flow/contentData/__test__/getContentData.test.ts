import { type CMSContent } from "../buildCmsContentAndTranslations";
import { getContentData } from "../getContentData";
import { type SchemaObject } from "~/domains/userData";
import { getPageSchema } from "~/domains/pageSchemas";
import z from "zod";
import { type createFlowSession } from "../../newFlowEngine/createFlowSession";

const mockCmsElement = {
  heading: "new heading",
  content: [
    {
      __component: "basic.paragraph" as const,
      text: "someText",
      html: "someText",
      id: 10,
    },
  ],
  preHeading: undefined,
  nextButtonLabel: undefined,
  backButtonLabel: undefined,
  postFormContent: [],
  formContent: [
    {
      __component: "form-elements.checkbox",
      label: "some label",
      name: "name",
      errorMessage: "",
      required: true,
      id: 10,
    },
  ],
  pageTitle: "page title",
} satisfies CMSContent;

const mockTranslations = {
  translation: "translation",
};

const mockUserData = {
  name: "testName",
  pageData: {},
};

const callContentData = getContentData(
  {
    cmsContent: mockCmsElement,
    translations: mockTranslations,
  },
  mockUserData,
  "/",
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

vi.mock("~/domains/pageSchemas", async () => {
  const actual = await vi.importActual("~/domains/pageSchemas");

  return {
    ...actual,
    getPageSchema: vi.fn(),
  };
});

const mockGetPageSchema = (pageSchema: SchemaObject | undefined) => {
  vi.mocked(getPageSchema).mockReturnValue(pageSchema);
};

describe("getContentData", () => {
  describe("getFormElements", () => {
    it("should return correctly the form elements", () => {
      const actual = callContentData.getFormElements();

      expect(actual).toEqual(mockCmsElement.formContent);
    });
  });

  describe("getTranslations", () => {
    it("should return correctly the translations", () => {
      const actual = callContentData.getTranslations();

      expect(actual).toEqual(mockTranslations);
    });
  });

  describe("getCMSContent", () => {
    it("should return correctly the cms content", () => {
      const actual = callContentData.getCMSContent();

      expect(actual).toEqual(mockCmsElement);
    });
  });

  describe("getStepData", () => {
    it("should return correctly the step data", () => {
      mockGetPageSchema({ name: z.string() });
      const actual = callContentData.getStepData();

      expect(actual).toEqual({ name: "testName" });
    });

    it("should return empty in case page schema is empty", () => {
      mockGetPageSchema(undefined);
      const actual = callContentData.getStepData();

      expect(actual).toEqual({});
    });
  });

  describe("getButtonNavigation", () => {
    it("should return correctly the button navigation", () => {
      const mockFlowSession = {
        isFinal: false,
        prevPath: "/back",
        getArrayInfoByPath: () => undefined,
      } as unknown as ReturnType<typeof createFlowSession>;

      const actual = callContentData.getButtonNavigation(
        "/beratungshilfe/antrag",
        mockFlowSession,
        [],
      );

      expect(actual).toEqual({
        back: {
          destination: "/beratungshilfe/antrag/back",
          label: "Zurück",
        },
        next: {
          label: "Weiter",
        },
      });
    });

    it("should replace the back destination with the array values", () => {
      const mockFlowSession = {
        isFinal: false,
        prevPath: "/kinder/#/name",
        getArrayInfoByPath: () => undefined,
      } as unknown as ReturnType<typeof createFlowSession>;

      const actual = callContentData.getButtonNavigation(
        "/beratungshilfe/antrag",
        mockFlowSession,
        [2],
      );

      expect(actual.back.destination).toEqual(
        "/beratungshilfe/antrag/kinder/2/name",
      );
    });

    it("should add the edit anchor to the back destination if array info is available", () => {
      const mockFlowSession = {
        isFinal: false,
        prevPath: "/kinder/uebersicht",
        getArrayInfoByPath: () => ({ name: "kinder" }),
      } as unknown as ReturnType<typeof createFlowSession>;

      const actual = callContentData.getButtonNavigation(
        "/beratungshilfe/antrag",
        mockFlowSession,
        [2],
      );

      expect(actual.back.destination).toEqual(
        "/beratungshilfe/antrag/kinder/uebersicht#array-summary-item-edit-kinder-2",
      );
    });
  });
});

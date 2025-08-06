import { type NavItem } from "~/components/navigation/types";
import { flows } from "~/domains/flows.server";
import {
  type ArraySummaryData,
  getArraySummaryData,
} from "~/services/array/getArraySummaryData";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { type CMSContent } from "../../buildCmsContentAndTranslations";
import { getContentData } from "../getContentData";

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
      id: 10,
    },
  ],
  pageMeta: {
    title: "title",
    description: null,
    ogTitle: null,
    breadcrumb: null,
  },
} satisfies CMSContent;

const mockTranslations = {
  translation: "translation",
};

const mockParentMeta = {
  description: "parentMeta description",
  ogTitle: "parentMeta ogTitle",
  breadcrumb: "parentMeta breadcrumb",
  title: "parentMeta title",
};

const mockCurrentFlow = flows["/beratungshilfe/antrag"];

const mockBuildFlowController = {
  getRootMeta: vi.fn().mockReturnValue(undefined),
  isFinal: vi.fn().mockReturnValue(false),
  getPrevious: vi.fn().mockReturnValue(""),
  stepStates: vi.fn().mockReturnValue(undefined),
} as unknown as ReturnType<typeof buildFlowController>;

const mockUserData = {
  name: "testName",
  pageData: { arrayIndexes: [] },
};

const callContentData = getContentData(
  {
    cmsContent: mockCmsElement,
    parentMeta: mockParentMeta,
    translations: mockTranslations,
  },
  mockUserData,
  mockCurrentFlow,
);

vi.mock("~/services/array/getArraySummaryData");
vi.mock("~/util/buttonProps");
vi.mock("~/services/flowNavigation.server");

describe("getContentData", () => {
  describe("arraySummaryData", () => {
    it("should return correctly the array summary data", () => {
      const addBankkonten = "add-bankkonten";
      const mockSummaryData = {
        bankkonten: {
          data: [],
          configuration: {
            url: "/bankkontenUrl",
            initialInputUrl: "daten",
            event: addBankkonten,
            disableAddButton: false,
          },
          itemsContent: [],
        },
      } satisfies ArraySummaryData;
      vi.mocked(getArraySummaryData).mockReturnValue(mockSummaryData);

      const actual = callContentData.arraySummaryData(mockBuildFlowController);

      expect(actual).toEqual(mockSummaryData);
    });
  });

  describe("getFormElements", () => {
    it("should return correctly the form elements", () => {
      const actual = callContentData.getFormElements();

      expect(actual).toEqual(mockCmsElement.formContent);
    });
  });

  describe("getMeta", () => {
    it("should return correctly the page meta", () => {
      const actual = callContentData.getMeta();

      expect(actual).toEqual({
        description: "parentMeta description",
        breadcrumb: "parentMeta breadcrumb",
        ogTitle: "parentMeta ogTitle",
        title: "title - parentMeta title",
      });
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
      const actual = callContentData.getStepData();

      expect(actual).toEqual({ name: "testName" });
    });
  });

  describe("getButtonNavigation", () => {
    it("should return correctly the button navigation", () => {
      const mockButtons = {
        back: {
          destination: "/back",
          label: "backButton",
        },
        next: {
          label: "backButton",
        },
      };

      vi.mocked(getButtonNavigationProps).mockReturnValue(mockButtons);

      const actual = callContentData.getButtonNavigation(
        mockBuildFlowController,
        "/",
        "/",
        [],
      );

      expect(actual).toEqual(mockButtons);
    });
  });

  describe("getNavItems", () => {
    it("should return correctly the nav items", () => {
      const mockNavItems = [
        {
          destination: "/",
          label: "/a",
          subflows: undefined,
          state: "Done",
        },
      ] satisfies NavItem[];

      vi.mocked(navItemsFromStepStates).mockReturnValue(mockNavItems);

      const actual = callContentData.getNavItems(mockBuildFlowController, "/");

      expect(actual).toEqual(mockNavItems);
    });

    it("should return empty array when nav items returns undefined", () => {
      vi.mocked(navItemsFromStepStates).mockReturnValue(undefined);

      const actual = callContentData.getNavItems(mockBuildFlowController, "/");

      expect(actual).toEqual([]);
    });
  });
});

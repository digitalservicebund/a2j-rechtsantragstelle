import { type NavItem } from "~/components/navigation/types";
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
      required: true,
      id: 10,
    },
  ],
  pageMeta: { title: "title" },
} satisfies CMSContent;

const mockTranslations = {
  translation: "translation",
};

const mockMeta = {
  description: "meta description",
  ogTitle: "meta ogTitle",
  breadcrumb: "meta breadcrumb",
  title: "meta title",
};

const mockBuildFlowController = {
  getRootMeta: vi.fn().mockReturnValue(undefined),
  isFinal: vi.fn().mockReturnValue(false),
  getPrevious: vi.fn().mockReturnValue(""),
  stepStates: vi.fn().mockReturnValue(undefined),
  getMeta: vi.fn().mockReturnValue(undefined),
} as unknown as ReturnType<typeof buildFlowController>;

const mockUserData = {
  name: "testName",
  pageData: { arrayIndexes: [] },
};

const callContentData = getContentData(
  {
    cmsContent: mockCmsElement,
    meta: mockMeta,
    translations: mockTranslations,
  },
  mockUserData,
);

vi.mock("~/services/array/getArraySummaryData");
vi.mock("~/util/buttonProps");
vi.mock("~/services/flowNavigation.server");

beforeEach(() => {
  vi.clearAllMocks();
});

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
          itemLabels: {},
          buttonLabel: "Add Bankkonto",
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
        description: "meta description",
        breadcrumb: "meta breadcrumb",
        ogTitle: "meta ogTitle",
        title: "meta title",
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

      const actual = callContentData.getNavProps(mockBuildFlowController, "/");

      expect(actual).toEqual({ navItems: mockNavItems, expandAll: undefined });
    });

    it("should return empty array when nav items returns undefined", () => {
      vi.mocked(navItemsFromStepStates).mockReturnValue(undefined);

      const actual = callContentData.getNavProps(mockBuildFlowController, "/");

      expect(actual).toEqual({
        expandAll: undefined,
        navItems: [],
      });
    });

    it("should call the navItemsFromStepStates with subStates of the current stepId when useStepper is true", () => {
      vi.mocked(mockBuildFlowController.getRootMeta).mockReturnValue({
        useStepper: true,
      });
      vi.mocked(mockBuildFlowController.stepStates).mockReturnValue([
        {
          stepId: "/somePath/menu",
          url: "/somePath/menu",
          isDone: true,
          isReachable: true,
          subStates: [
            {
              stepId: "/somePath/menu/page1",
              url: "/somePath/menu/page1",
              isDone: true,
              isReachable: true,
            },
            {
              stepId: "/somePath/menu/page2",
              url: "/somePath/menu/page2",
              isDone: false,
              isReachable: true,
            },
          ],
        },
        {
          stepId: "/anotherPath/menu",
          url: "/anotherPath/menu",
          isDone: true,
          isReachable: true,
          subStates: [
            {
              stepId: "/anotherPath/menu/page3",
              url: "/anotherPath/menu/page3",
              isDone: false,
              isReachable: false,
            },
          ],
        },
      ]);

      const callContentDataWithStepper = getContentData(
        {
          cmsContent: mockCmsElement,
          meta: mockMeta,
          translations: mockTranslations,
        },
        mockUserData,
      );

      callContentDataWithStepper.getNavProps(
        mockBuildFlowController,
        "/somePath/menu/page1",
      );

      expect(navItemsFromStepStates).toHaveBeenCalledTimes(1);

      expect(navItemsFromStepStates).toHaveBeenCalledWith(
        "/somePath/menu/page1",
        [
          {
            stepId: "/somePath/menu/page1",
            url: "/somePath/menu/page1",
            isDone: true,
            isReachable: true,
          },
          {
            stepId: "/somePath/menu/page2",
            url: "/somePath/menu/page2",
            isDone: false,
            isReachable: true,
          },
        ],
        mockTranslations,
      );
    });
  });
});

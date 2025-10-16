import { describe, it, expect, vi } from "vitest";
import { generateSummaryFromUserData } from "../autoGenerateSummary";
import type { UserData } from "~/domains/userData";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { FlowId } from "~/domains/flowIds";

// Mock the dependencies
vi.mock("../getFormQuestions", () => ({
  getFormQuestionsForFields: vi.fn(),
  createFieldToStepMapping: vi.fn(),
}));

vi.mock("~/services/flow/server/buildFlowController", () => ({
  groupFieldsByFlowNavigation: vi.fn(),
}));

vi.mock("~/services/cms/fetchAllFormFields", () => ({
  fetchAllFormFields: vi.fn(),
}));

const { getFormQuestionsForFields, createFieldToStepMapping } = await import("../getFormQuestions");
const { groupFieldsByFlowNavigation } = await import("~/services/flow/server/buildFlowController");
const { fetchAllFormFields } = await import("~/services/cms/fetchAllFormFields");

const mockGetFormQuestionsForFields = vi.mocked(getFormQuestionsForFields);
const mockCreateFieldToStepMapping = vi.mocked(createFieldToStepMapping);
const mockGroupFieldsByFlowNavigation = vi.mocked(groupFieldsByFlowNavigation);
const mockFetchAllFormFields = vi.mocked(fetchAllFormFields);

describe("generateSummaryFromUserData", () => {
  const mockUserData: UserData = {
    vorname: "Max",
    nachname: "Mustermann",
    geburtsdatum: "1990-01-15",
    emptyField: "",
  };

  const mockFlowId: FlowId = "/beratungshilfe/antrag";

  const mockTranslations: Translations = {
    "fields.vorname": "Vorname",
    "fields.nachname": "Nachname",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set default mock returns
    mockFetchAllFormFields.mockResolvedValue({} as any);
  });

  it("should generate summary sections with form data", async () => {
    mockGetFormQuestionsForFields.mockResolvedValue({
      vorname: { question: "Wie ist Ihr Vorname?", fieldName: "vorname", stepId: "/test" },
      nachname: { question: "Wie ist Ihr Nachname?", fieldName: "nachname", stepId: "/test" },
    });

    mockCreateFieldToStepMapping.mockReturnValue({
      vorname: "/persoenliche-daten/grunddaten",
      nachname: "/persoenliche-daten/grunddaten",
    });

    mockGroupFieldsByFlowNavigation.mockResolvedValue({
      "persoenliche-daten": {
        grunddaten: ["vorname", "nachname"],
      },
    });

    const result = await generateSummaryFromUserData(
      mockUserData,
      mockFlowId,
      mockTranslations
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      __component: "page.summary-overview-section",
      id: 1,
      title: {
        __component: "basic.heading",
        text: "Persönliche Angaben",
        tagName: "h2",
        look: "ds-heading-02-reg",
      },
    });
    expect(result[0].boxes).toHaveLength(1);
    expect(result[0].boxes[0].boxItems).toHaveLength(3); // vorname, nachname, geburtsdatum
  });

  it("should return empty array when no valid user data fields", async () => {
    const emptyUserData: UserData = {
      pageData: "some data", // This gets filtered out
      emptyField: "", // This is empty
    };

    const result = await generateSummaryFromUserData(
      emptyUserData,
      mockFlowId,
      mockTranslations
    );

    expect(result).toHaveLength(0);
  });

  it("should call getFormQuestionsForFields with user data fields", async () => {
    mockGetFormQuestionsForFields.mockResolvedValue({});
    mockCreateFieldToStepMapping.mockReturnValue({});
    mockGroupFieldsByFlowNavigation.mockResolvedValue({});

    await generateSummaryFromUserData(
      mockUserData,
      mockFlowId,
      mockTranslations
    );

    expect(mockGetFormQuestionsForFields).toHaveBeenCalledWith(
      ["vorname", "nachname", "geburtsdatum", "emptyField"], // emptyField is actually not filtered at this stage
      mockFlowId
    );
  });

  it("should work without translations", async () => {
    mockGetFormQuestionsForFields.mockResolvedValue({
      vorname: { question: "Wie ist Ihr Vorname?", fieldName: "vorname", stepId: "/test" },
    });
    mockCreateFieldToStepMapping.mockReturnValue({
      vorname: "/persoenliche-daten/grunddaten",
    });
    mockGroupFieldsByFlowNavigation.mockResolvedValue({
      "persoenliche-daten": {
        grunddaten: ["vorname"],
      },
    });

    const result = await generateSummaryFromUserData(
      { vorname: "Max" },
      mockFlowId
    );

    expect(result).toHaveLength(1);
  });

  it("should handle case when no flow controller is provided", async () => {
    mockGetFormQuestionsForFields.mockResolvedValue({
      vorname: { question: "Wie ist Ihr Vorname?", fieldName: "vorname", stepId: "/test" },
    });
    mockCreateFieldToStepMapping.mockReturnValue({
      vorname: "/persoenliche-daten/grunddaten",
    });

    // When no flow controller is provided, it should use the fallback grouping
    await generateSummaryFromUserData(
      { vorname: "Max" },
      mockFlowId,
      mockTranslations
    );

    // Should still work, just with different grouping logic
    expect(mockGroupFieldsByFlowNavigation).not.toHaveBeenCalled();
  });
});
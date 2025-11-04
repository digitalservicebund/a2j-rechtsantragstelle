import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateSummaryFromUserData } from "../autoGenerateSummary";
import type { UserData } from "~/domains/userData";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { FlowId } from "~/domains/flowIds";
import type { FlowController } from "~/services/flow/server/buildFlowController";

// Only mock the external CMS dependency
vi.mock("~/services/cms/fetchAllFormFields", () => ({
  fetchAllFormFields: vi.fn(),
}));

// Mock the CMS flow page fetching for getFormQuestions
vi.mock("~/services/cms/index.server", () => ({
  fetchFlowPage: vi.fn(),
}));

const { fetchAllFormFields } = await import(
  "~/services/cms/fetchAllFormFields"
);
const { fetchFlowPage } = await import("~/services/cms/index.server");

const mockFetchAllFormFields = vi.mocked(fetchAllFormFields);
const mockFetchFlowPage = vi.mocked(fetchFlowPage);

describe("generateSummaryFromUserData", () => {
  const mockUserData: UserData = {
    vorname: "Max",
    nachname: "Mustermann",
    geburtsdatum: { day: "15", month: "01", year: "1990" },
    emptyField: "",
    berufart: {
      selbststaendig: "on",
      festangestellt: "off",
    },
    kinder: [
      {
        vorname: "Anna",
        nachname: "Schmidt",
        geburtsdatum: "10.06.2015",
        wohnortBeiAntragsteller: "yes",
        eigeneEinnahmen: "no",
      },
      {
        vorname: "Ben",
        nachname: "Schmidt",
        geburtsdatum: "22.03.2018",
        wohnortBeiAntragsteller: "yes",
        eigeneEinnahmen: "no",
      },
    ],
  };

  const mockFlowId: FlowId = "/beratungshilfe/antrag";

  const mockTranslations: Translations = {
    "persoenliche-daten": "Persönliche Daten",
    "finanzielle-angaben": "Finanzielle Angaben",
    kinder: "Kinder",
    "fields.vorname": "Vorname",
    "fields.nachname": "Nachname",
  };

  const mockFlowController: FlowController = {
    stepStates: () => [
      {
        stepId: "/persoenliche-daten",
        subStates: [
          {
            stepId: "/persoenliche-daten/grunddaten",
            subStates: [],
          },
        ],
      },
      {
        stepId: "/finanzielle-angaben",
        subStates: [
          {
            stepId: "/finanzielle-angaben/kinder",
            subStates: [],
          },
        ],
      },
    ],
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFetchAllFormFields.mockResolvedValue({
      "/persoenliche-daten/name": ["vorname", "nachname"],
      "/persoenliche-daten/geburtsdatum": ["geburtsdatum"],
      "/finanzielle-angaben/einkommen/art": [
        "berufart.selbststaendig",
        "berufart.festangestellt",
      ],
      "/finanzielle-angaben/kinder/kinder/name": [
        "kinder#vorname",
        "kinder#nachname",
        "kinder#geburtsdatum",
      ],
      "/finanzielle-angaben/kinder/kinder/wohnort": [
        "kinder#wohnortBeiAntragsteller",
      ],
      "/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage": [
        "kinder#eigeneEinnahmen",
      ],
    });

    // Mock CMS flow page responses for getFormQuestions
    mockFetchFlowPage.mockImplementation((_collection, _flowId, stepId) => {
      const mockFormPages: Record<string, any> = {
        "/beratungshilfe/antrag/persoenliche-daten/name": {
          pageTitle: "Name",
          locale: "de" as const,
          heading: "Name",
          stepId: stepId,
          flow_ids: [],
          preHeading: null,
          pre_form: [],
          post_form: [],
          form: [
            {
              __component: "form-elements.input",
              name: "vorname",
              label: "Wie ist Ihr Vorname?",
            },
            {
              __component: "form-elements.input",
              name: "nachname",
              label: "Wie ist Ihr Nachname?",
            },
          ],
        },
        "/beratungshilfe/antrag/persoenliche-daten/geburtsdatum": {
          pageTitle: "Geburtsdatum",
          locale: "de" as const,
          heading: "Geburtsdatum",
          stepId: stepId,
          flow_ids: [],
          preHeading: null,
          pre_form: [],
          post_form: [],
          form: [
            {
              __component: "form-elements.input",
              name: "geburtsdatum",
              label: "Wann wurden Sie geboren?",
            },
          ],
        },
        "/beratungshilfe/antrag/finanzielle-angaben/einkommen/art": {
          pageTitle: "Berufliche Situation",
          locale: "de" as const,
          heading: "Berufliche Situation",
          stepId: stepId,
          flow_ids: [],
          preHeading: null,
          pre_form: [],
          post_form: [],
          form: [
            {
              __component: "form-elements.checkbox",
              name: "berufart.selbststaendig",
              label: "Sind Sie selbstständig?",
            },
            {
              __component: "form-elements.checkbox",
              name: "berufart.festangestellt",
              label: "Sind Sie festangestellt?",
            },
          ],
        },
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name": {
          pageTitle: "Kinder Name",
          locale: "de" as const,
          heading: "Kinder Name",
          stepId: stepId,
          flow_ids: [],
          preHeading: null,
          pre_form: [],
          post_form: [],
          form: [
            {
              __component: "form-elements.input",
              name: "kinder#vorname",
              label: "Wie heißt {{kind#vorname}} {{kind#nachname}}?",
            },
            {
              __component: "form-elements.input",
              name: "kinder#nachname",
              label: "Wie lautet der Nachname?",
            },
            {
              __component: "form-elements.input",
              name: "kinder#geburtsdatum",
              label: "Wann wurde {{kind#vorname}} geboren?",
            },
          ],
        },
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/wohnort": {
          pageTitle: "Wohnort",
          locale: "de" as const,
          heading: "Wohnort",
          stepId: stepId,
          flow_ids: [],
          preHeading: null,
          pre_form: [],
          post_form: [],
          form: [
            {
              __component: "form-elements.radio",
              name: "kinder#wohnortBeiAntragsteller",
              label: "Lebt {{kind#vorname}} bei Ihnen?",
            },
          ],
        },
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage":
          {
            pageTitle: "Eigene Einnahmen",
            locale: "de" as const,
            heading: "Eigene Einnahmen",
            stepId: stepId,
            flow_ids: [],
            preHeading: null,
            pre_form: [],
            post_form: [],
            form: [
              {
                __component: "form-elements.radio",
                name: "kinder#eigeneEinnahmen",
                label:
                  "Hat {{kind#vorname}} {{kind#nachname}} eigene Einnahmen?",
              },
            ],
          },
      };

      return (
        mockFormPages[stepId] || {
          pageTitle: "Unknown",
          locale: "de" as const,
          heading: "Unknown",
          stepId: stepId,
          flow_ids: [],
          preHeading: null,
          pre_form: [],
          post_form: [],
          form: [],
        }
      );
    });
  });

  describe("basic functionality", () => {
    it("should return empty array when no valid user data fields", async () => {
      const emptyUserData: UserData = {
        pageData: "excluded",
      };

      const result = await generateSummaryFromUserData(
        emptyUserData,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      expect(result).toHaveLength(0);
    });

    it("should generate summary sections with regular fields", async () => {
      const simpleUserData: UserData = {
        vorname: "Max",
        nachname: "Mustermann",
      };

      const result = await generateSummaryFromUserData(
        simpleUserData,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "persoenliche-daten",
        title: "Persönliche Daten",
      });

      expect(result[0].fields).toHaveLength(2);
      expect(result[0].fields[0]).toMatchObject({
        answer: "Max",
        editUrl: expect.stringContaining("/persoenliche-daten/name"),
        isArrayItem: false,
      });
      expect(result[0].fields[1]).toMatchObject({
        answer: "Mustermann",
        editUrl: expect.stringContaining("/persoenliche-daten/name"),
        isArrayItem: false,
      });
    });

    it("should handle empty fields with 'Keine Angabe'", async () => {
      const userDataWithEmpty: UserData = {
        vorname: "Max",
        nachname: "", // Empty field
      };

      const result = await generateSummaryFromUserData(
        userDataWithEmpty,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      // Find the field with empty answer (should be the nachname field)
      const emptyField = result[0].fields.find(
        (field) => field.answer === "Keine Angabe",
      );

      expect(emptyField).toBeDefined();
      expect(emptyField?.answer).toBe("Keine Angabe");
    });
  });

  describe("array field handling", () => {
    it("should create array groups for array fields", async () => {
      const result = await generateSummaryFromUserData(
        mockUserData,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      const finanzielleSection = result.find(
        (section) => section.id === "finanzielle-angaben",
      );

      expect(finanzielleSection).toBeDefined();
      expect(finanzielleSection?.arrayGroups).toBeDefined();
      expect(finanzielleSection?.arrayGroups).toHaveLength(1);

      const kinderGroup = finanzielleSection?.arrayGroups?.[0];
      expect(kinderGroup).toBeDefined();
      expect(kinderGroup?.id).toBe("kinder");
      expect(kinderGroup?.title).toBe("Kinder");

      // Should have array items
      expect(kinderGroup?.items).toHaveLength(2);

      // Check first child structure
      const firstChild = kinderGroup?.items[0];
      expect(firstChild?.editUrl).toContain("/finanzielle-angaben/kinder");
      expect(firstChild?.multipleQuestions).toHaveLength(5); // vorname, nachname, geburtsdatum, wohnort, eigeneEinnahmen

      // Check that we have Anna's data
      const annaNameAnswer = firstChild?.multipleQuestions?.find(
        (q) => q.answer === "Anna",
      );
      expect(annaNameAnswer).toBeDefined();
    });

    it("should group multiple array items correctly", async () => {
      const result = await generateSummaryFromUserData(
        mockUserData,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      const finanzielleSection = result.find(
        (section) => section.id === "finanzielle-angaben",
      );
      const kinderGroup = finanzielleSection?.arrayGroups?.[0];

      // Should have 2 array items (Anna and Ben)
      expect(kinderGroup?.items).toHaveLength(2);

      // First child data
      const firstChildAnswers = kinderGroup?.items[0].multipleQuestions?.map(
        (q) => q.answer,
      );
      expect(firstChildAnswers).toContain("Anna");
      expect(firstChildAnswers).toContain("Schmidt");
      expect(firstChildAnswers).toContain("10.06.2015");

      // Second child data
      const secondChildAnswers = kinderGroup?.items[1].multipleQuestions?.map(
        (q) => q.answer,
      );
      expect(secondChildAnswers).toContain("Ben");
      expect(secondChildAnswers).toContain("Schmidt");
      expect(secondChildAnswers).toContain("22.03.2018");
    });

    it("should handle array field processing correctly", async () => {
      const result = await generateSummaryFromUserData(
        mockUserData,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      const finanzielleSection = result.find(
        (section) => section.id === "finanzielle-angaben",
      );
      const kinderGroup = finanzielleSection?.arrayGroups?.[0];

      expect(kinderGroup?.items).toHaveLength(2);

      expect(kinderGroup?.items[0].multipleQuestions).toHaveLength(5);
      expect(kinderGroup?.items[1].multipleQuestions).toHaveLength(5);

      // Verify edit URLs contain array reference
      expect(kinderGroup?.items[0].editUrl).toContain("kinder");
      expect(kinderGroup?.items[1].editUrl).toContain("kinder");
    });
  });

  describe("nested object handling", () => {
    it("should process user data fields correctly", async () => {
      const result = await generateSummaryFromUserData(
        mockUserData,
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      expect(result.length).toBeGreaterThan(0);

      // Should have both persoenliche-daten and finanzielle-angaben sections
      const sectionIds = result.map((section) => section.id);
      expect(sectionIds).toContain("persoenliche-daten");
      expect(sectionIds).toContain("finanzielle-angaben");
    });
  });

  describe("edge cases", () => {
    it("should work without flow controller", async () => {
      const result = await generateSummaryFromUserData(
        { vorname: "Max" },
        mockFlowId,
        undefined, // No flow controller
        mockTranslations,
      );

      // Should return empty when no flow controller provided
      expect(result).toHaveLength(0);
    });

    it("should work without translations", async () => {
      const result = await generateSummaryFromUserData(
        { vorname: "Max" },
        mockFlowId,
        mockFlowController,
        undefined, // No translations
      );

      expect(result).toHaveLength(1);
      // Should use fallback section titles
      expect(result[0].title).toBe("persoenliche-daten"); // Fallback to ID
    });

    it("should skip sections with no fields", async () => {
      // Mock a form field mapping that would result in no matching fields
      mockFetchAllFormFields.mockResolvedValue({
        "/some-other-section": ["nonexistent-field"],
      });

      const result = await generateSummaryFromUserData(
        { vorname: "Max" },
        mockFlowId,
        mockFlowController,
        mockTranslations,
      );

      // Should not create sections for fields that don't exist in userData
      expect(result).toHaveLength(0);
    });
  });
});

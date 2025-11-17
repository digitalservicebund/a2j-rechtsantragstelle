import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFieldToStepMapping,
  findStepIdForField,
  getFormQuestionsForFields,
  extractOptionsFromComponent,
  createFieldQuestionFromComponent,
  processNestedComponents,
  processFieldForQuestions,
} from "../getFormQuestions";
import { fetchFlowPage } from "~/services/cms/index.server";
import { type StrapiInputComponentSchema } from "~/services/cms/models/formElements/StrapiInput";
import { type StrapiSelectComponentSchema } from "~/services/cms/models/formElements/StrapiSelect";
import { type StrapiTileGroupComponentSchema } from "~/services/cms/models/formElements/StrapiTileGroup";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { z } from "zod";

type StrapiInputComponentOutput = z.output<typeof StrapiInputComponentSchema>;
type StrapiSelectComponentOutput = z.output<typeof StrapiSelectComponentSchema>;
type StrapiTileGroupComponentOutput = z.output<
  typeof StrapiTileGroupComponentSchema
>;

vi.mock("~/domains/flows.server", () => ({
  flows: {
    "/beratungshilfe/antrag": {
      flowType: "formFlow",
    },
    "/invalidFlow": {
      flowType: "other",
    },
  },
}));

vi.mock("~/services/cms/fetchAllFormFields", () => ({
  fetchAllFormFields: vi.fn(),
}));

vi.mock("~/services/cms/index.server", () => ({
  fetchFlowPage: vi.fn(),
}));
describe("createFieldToStepMapping", () => {
  it("should create mapping from form fields", () => {
    const formFieldsMap = {
      "/persoenliche-daten/name": ["vorname", "nachname"],
      "/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten": [
        "bankkonten#kontoEigentuemer",
        "bankkonten#kontostand",
      ],
      "/finanzielle-angaben/kinder/kinder/name": [
        "kinder#vorname",
        "kinder#nachname",
      ],
    };

    const result = createFieldToStepMapping(formFieldsMap);

    expect(result).toEqual({
      vorname: "/persoenliche-daten/name",
      nachname: "/persoenliche-daten/name",
      "bankkonten#kontoEigentuemer":
        "/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
      "bankkonten#kontostand":
        "/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
      "kinder#vorname": "/finanzielle-angaben/kinder/kinder/name",
      "kinder#nachname": "/finanzielle-angaben/kinder/kinder/name",
    });
  });
});

describe("findStepIdForField", () => {
  const fieldMapping = {
    rechtsschutzversicherung:
      "/beratungshilfe/antrag/grundvoraussetzungen/rechtsschutzversicherung",
    vorname: "/beratungshilfe/antrag/persoenliche-daten/name",
    nachname: "/beratungshilfe/antrag/persoenliche-daten/name",
    geburtsdatum: "/beratungshilfe/antrag/persoenliche-daten/geburtsdatum",
    plz: "/beratungshilfe/antrag/persoenliche-daten/plz",
    einkommen: "/beratungshilfe/antrag/finanzielle-angaben/einkommen/einkommen",
    partnerEinkommenSumme:
      "/beratungshilfe/antrag/finanzielle-angaben/partner/partner-einkommen-summe",
    hasBankkonto:
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
    "bankkonten#kontoEigentuemer":
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
    "bankkonten#kontostand":
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
    "bankkonten#iban":
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
    "kinder#vorname":
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
    "kinder#nachname":
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
    "kinder#wohnortBeiAntragsteller":
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
    "unterhaltszahlungen#familyRelationship":
      "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
    "unterhaltszahlungen#firstName":
      "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
    "wertsachen#art":
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/daten",
    "berufart.selbststaendig":
      "/beratungshilfe/antrag/finanzielle-angaben/einkommen/art",
  };

  describe("Direct field lookup", () => {
    it("should find regular fields", () => {
      expect(findStepIdForField("vorname", fieldMapping)).toBe(
        "/beratungshilfe/antrag/persoenliche-daten/name",
      );

      expect(findStepIdForField("einkommen", fieldMapping)).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/einkommen/einkommen",
      );
    });
  });

  describe("Nested field patterns", () => {
    it("should handle nested object fields like berufart.selbststaendig", () => {
      const result = findStepIdForField("berufart", fieldMapping);
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/einkommen/art",
      );
    });
  });

  describe("Array field handling", () => {
    it("should handle array fields", () => {
      expect(findStepIdForField("bankkonten[0]", fieldMapping)).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
      );

      expect(findStepIdForField("kinder[0]", fieldMapping)).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
      );
    });

    it("should handle array sub-fields", () => {
      expect(findStepIdForField("bankkonten[0].kontostand", fieldMapping)).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
      );

      expect(findStepIdForField("kinder[0].vorname", fieldMapping)).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
      );

      expect(
        findStepIdForField("unterhaltszahlungen[0].firstName", fieldMapping),
      ).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
      );

      expect(findStepIdForField("wertsachen[0].art", fieldMapping)).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/daten",
      );
    });
  });

  describe("Edge cases", () => {
    it("should return undefined for unknown fields", () => {
      expect(findStepIdForField("unknownField", fieldMapping)).toBeUndefined();
    });

    it("should return undefined for unknown array fields", () => {
      expect(
        findStepIdForField("unknownArray[0].field", fieldMapping),
      ).toBeUndefined();
    });
  });
});

describe("getFormQuestionsForFields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get questions for regular fields", async () => {
    const mockFormPage: StrapiFormFlowPage = {
      pageTitle: "Rechtsschutzversicherung",
      locale: "de",
      stepId: "/grundvoraussetzungen/rechtsschutz",
      heading: "Rechtsschutzversicherung",
      pre_form: [],
      form: [
        {
          __component: "form-elements.input",
          id: 1,
          name: "rechtsschutzversicherung",
          label: "Haben Sie eine Rechtsschutzversicherung?",
          altLabel: undefined,
          type: "text",
          width: undefined,
          errorMessages: [],
        } as StrapiInputComponentOutput,
      ],
      post_form: [],
      flow_ids: [],
    };

    vi.mocked(fetchFlowPage).mockResolvedValue(mockFormPage);

    const result = await getFormQuestionsForFields(
      ["rechtsschutzversicherung"],
      { rechtsschutzversicherung: "/grundvoraussetzungen/rechtsschutz" },
      "/beratungshilfe/antrag",
    );

    expect(result).toEqual({
      rechtsschutzversicherung: {
        question: "Haben Sie eine Rechtsschutzversicherung?",
      },
    });
  });

  it("should get questions for array sub-fields", async () => {
    const mockFormPage: StrapiFormFlowPage = {
      pageTitle: "Kind Angaben",
      locale: "de",
      stepId: "/kinder/name",
      heading: "Angaben zum Kind",
      pre_form: [],
      form: [
        {
          __component: "form-elements.input",
          id: 1,
          name: "kinder#vorname",
          label: "Vorname des Kindes",
          altLabel: undefined,
          type: "text",
          width: undefined,
          errorMessages: [],
        } as StrapiInputComponentOutput,
      ],
      post_form: [],
      flow_ids: [],
    };

    vi.mocked(fetchFlowPage).mockResolvedValue(mockFormPage);

    const result = await getFormQuestionsForFields(
      ["kinder[0].vorname"],
      { "kinder#vorname": "/kinder/name" },
      "/beratungshilfe/antrag",
    );

    expect(result).toEqual({
      "kinder[0].vorname": {
        question: "Vorname des Kindes",
      },
    });
  });
});

describe("extractOptionsFromComponent", () => {
  it("should extract options from select component", () => {
    const component: StrapiSelectComponentOutput = {
      __component: "form-elements.select",
      name: "selection",
      label: "Choose option",
      altLabel: undefined,
      options: [
        { text: "Option 1", value: "opt1" },
        { text: "Option 2", value: "opt2" },
      ],
      errorMessages: [],
      id: 1,
    };

    const result = extractOptionsFromComponent(component);

    expect(result).toEqual([
      { text: "Option 1", value: "opt1" },
      { text: "Option 2", value: "opt2" },
    ]);
  });

  it("should extract options from tile-group component", () => {
    const component: StrapiTileGroupComponentOutput = {
      __component: "form-elements.tile-group",
      name: "tileSelection",
      label: "Choose tile",
      altLabel: undefined,
      options: [
        {
          title: "First Tile",
          value: "first",
          description: undefined,
          image: undefined,
          tagDescription: undefined,
        },
        {
          title: "Second Tile",
          value: "second",
          description: undefined,
          image: undefined,
          tagDescription: undefined,
        },
      ],
      errorMessages: [],
      useTwoColumns: false,
      id: 1,
    };

    const result = extractOptionsFromComponent(component);

    expect(result).toEqual([
      { text: "First Tile", value: "first" },
      { text: "Second Tile", value: "second" },
    ]);
  });

  it("should return undefined for components without options", () => {
    const component = {
      __component: "form-elements.input",
      name: "vorname",
      label: "Vorname",
      type: "text",
      placeholder: undefined,
      suffix: undefined,
      errors: [],
      width: undefined,
      helperText: undefined,
      id: 1,
    } as any;

    const result = extractOptionsFromComponent(component);

    expect(result).toBeUndefined();
  });

  it("should return undefined for components with non-array options", () => {
    const component = {
      __component: "form-elements.select",
      options: "invalid",
    } as any;

    const result = extractOptionsFromComponent(component);

    expect(result).toBeUndefined();
  });
});

describe("createFieldQuestionFromComponent", () => {
  it("should create field question with label", () => {
    const component = {
      __component: "form-elements.input",
      name: "vorname",
      label: "Wie ist Ihr Vorname?",
    } as any;

    const formPage = {} as any;

    const result = createFieldQuestionFromComponent(component, formPage);

    expect(result).toEqual({
      question: "Wie ist Ihr Vorname?",
    });
  });

  it("should create field question with options", () => {
    const component = {
      __component: "form-elements.select",
      name: "auswahl",
      label: "Wählen Sie:",
      options: [
        { text: "Ja", value: "yes" },
        { text: "Nein", value: "no" },
      ],
    } as any;

    const formPage = {} as any;

    const result = createFieldQuestionFromComponent(component, formPage);

    expect(result).toEqual({
      question: "Wählen Sie:",
      options: [
        { text: "Ja", value: "yes" },
        { text: "Nein", value: "no" },
      ],
    });
  });

  it("should use page heading when no label is provided", () => {
    const component: StrapiInputComponentOutput = {
      __component: "form-elements.input",
      name: "vorname",
      label: undefined,
      type: "text",
      placeholder: undefined,
      suffix: undefined,
      errorMessages: [],
      width: undefined,
      helperText: undefined,
      id: 1,
    };

    const formPage: StrapiFormFlowPage = {
      heading: "Wie ist Ihr Vorname?",
      stepId: "/test",
      flow_ids: [],
      preHeading: undefined,
      nextButtonLabel: undefined,
      backButtonLabel: undefined,
      pre_form: [],
      form: [],
      post_form: [],
      locale: "de",
      pageTitle: "Test Page",
    };

    const result = createFieldQuestionFromComponent(component, formPage);

    expect(result).toEqual({
      question: "Wie ist Ihr Vorname?",
    });
  });
});

describe("processNestedComponents", () => {
  it("should process nested components in fieldsets", () => {
    const formPage: StrapiFormFlowPage = {
      heading: "Page Heading",
      stepId: "/test",
      flow_ids: [],
      preHeading: undefined,
      nextButtonLabel: undefined,
      backButtonLabel: undefined,
      pre_form: [],
      form: [
        {
          __component: "form-elements.input",
          name: "vorname.first",
          label: "Wie ist Ihr Vorname?",
          type: "text",
          placeholder: "",
          suffix: "",
          errorMessages: [],
          width: "3",
          helperText: undefined,
          id: 1,
        },
      ],
      post_form: [],
      locale: "de",
      pageTitle: "Test Page",
    };

    const result = processNestedComponents("vorname", formPage);

    expect(result).toEqual({
      question: "Page Heading",
      options: [
        {
          text: "Wie ist Ihr Vorname?",
          value: "first",
        },
      ],
    });
  });

  it("should return null if field not found in nested components", () => {
    const formPage: StrapiFormFlowPage = {
      heading: "Page Heading",
      stepId: "/test",
      flow_ids: [],
      preHeading: undefined,
      nextButtonLabel: undefined,
      backButtonLabel: undefined,
      pre_form: [],
      form: [
        {
          __component: "form-elements.input",
          name: "otherField.sub",
          label: "Other",
          type: "text",
          placeholder: "",
          suffix: "",
          errorMessages: [],
          width: "3",
          helperText: undefined,
          id: 1,
        },
      ],
      post_form: [],
      locale: "de",
      pageTitle: "Test Page",
    };

    const result = processNestedComponents("vorname", formPage);

    expect(result).toBeNull();
  });
});

describe("processFieldForQuestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process field and return question", async () => {
    const fieldToStepMapping = {
      vorname: "/step1",
    };

    const stepPagesCache = {};

    vi.mocked(fetchFlowPage).mockResolvedValue({
      form: [
        {
          __component: "form-elements.input",
          name: "vorname",
          label: "Wie ist Ihr Vorname?",
        },
      ],
    } as any);

    const result = await processFieldForQuestions(
      "vorname",
      fieldToStepMapping,
      stepPagesCache,
      "/beratungshilfe/antrag",
    );

    expect(result).toEqual({
      question: "Wie ist Ihr Vorname?",
    });
  });

  it("should use cache for already fetched pages", async () => {
    const fieldToStepMapping = {
      vorname: "/step1",
    };

    const stepPagesCache = {
      "/step1": {
        form: [
          {
            __component: "form-elements.input",
            name: "vorname",
            label: "Cached question",
          },
        ],
      },
    } as any;

    const result = await processFieldForQuestions(
      "vorname",
      fieldToStepMapping,
      stepPagesCache,
      "/beratungshilfe/antrag",
    );

    expect(result).toEqual({
      question: "Cached question",
    });

    expect(vi.mocked(fetchFlowPage)).not.toHaveBeenCalled();
  });

  it("should return null for unknown field", async () => {
    const fieldToStepMapping = {};
    const stepPagesCache = {};

    const result = await processFieldForQuestions(
      "unknownField",
      fieldToStepMapping,
      stepPagesCache,
      "/beratungshilfe/antrag",
    );

    expect(result).toBeNull();
  });
});

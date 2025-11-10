import { describe, it, expect, vi } from "vitest";
import { groupFieldsByFlowNavigation } from "../groupFieldsBySection";

vi.mock("./sectionMapping", () => ({
  createStepToSectionMapping: vi.fn(() => ({
    "/persoenliche-daten/name": {
      sectionKey: "/persoenliche-daten",
      sectionTitle: "Persönliche Daten",
    },
    "/finanzielle-angaben/einkommen": {
      sectionKey: "/finanzielle-angaben",
      sectionTitle: "Finanzielle Angaben",
    },
  })),
  getSectionFromStepId: vi.fn((stepId) => ({
    sectionKey: stepId.includes("persoenliche")
      ? "/persoenliche-daten"
      : "/finanzielle-angaben",
    sectionTitle: stepId.includes("persoenliche")
      ? "/persoenliche-daten"
      : "/finanzielle-angaben",
    boxKey: stepId.split("/").pop(),
  })),
  addFieldToGroup: vi.fn((groups, sectionKey, boxKey, field) => {
    if (!groups[sectionKey]) {
      groups[sectionKey] = {};
    }
    if (!groups[sectionKey][boxKey]) {
      groups[sectionKey][boxKey] = [];
    }
    groups[sectionKey][boxKey].push(field);
  }),
}));

vi.mock("./getFormQuestions", () => ({
  findStepIdForField: vi.fn((field, mapping) => mapping[field]),
}));

describe("groupFieldsBySection", () => {
  const mockFlowController = {
    stepStates: vi.fn(() => [
      {
        stepId: "/persoenliche-daten",
        subStates: [
          { stepId: "/persoenliche-daten/name", subStates: [] },
          { stepId: "/persoenliche-daten/geburtsdatum", subStates: [] },
        ],
      },
      {
        stepId: "/finanzielle-angaben",
        subStates: [
          { stepId: "/finanzielle-angaben/einkommen", subStates: [] },
        ],
      },
    ]),
  };

  const mockFieldToStepMapping = {
    vorname: "/beratungshilfe/antrag/persoenliche-daten/name",
    nachname: "/beratungshilfe/antrag/persoenliche-daten/name",
    einkommen: "/beratungshilfe/antrag/finanzielle-angaben/einkommen",
    "kinder[0].vorname":
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/name",
  };

  const mockTranslations = {
    "persoenliche-daten": "Persönliche Daten",
    "finanzielle-angaben": "Finanzielle Angaben",
  };

  it("should group fields by flow navigation", () => {
    const result = groupFieldsByFlowNavigation(
      ["vorname", "nachname", "einkommen"],
      mockFlowController as any,
      mockFieldToStepMapping,
      mockTranslations,
      "/beratungshilfe/antrag",
    );

    expect(result.groups).toEqual({
      "persoenliche-daten": {
        name: ["vorname", "nachname"],
      },
      "finanzielle-angaben": {
        einkommen: ["einkommen"],
      },
    });

    expect(result.sectionTitles).toEqual({
      "persoenliche-daten": "/persoenliche-daten",
      "finanzielle-angaben": "/finanzielle-angaben",
    });
  });

  it("should group array fields by base field and index", () => {
    const result = groupFieldsByFlowNavigation(
      ["kinder[0].vorname", "kinder[1].vorname"],
      mockFlowController as any,
      {
        "kinder[0].vorname":
          "/beratungshilfe/antrag/finanzielle-angaben/kinder/name",
        "kinder[1].vorname":
          "/beratungshilfe/antrag/finanzielle-angaben/kinder/name",
      },
      mockTranslations,
      "/beratungshilfe/antrag",
    );

    expect(result.groups).toEqual({
      "finanzielle-angaben": {
        "kinder-0": ["kinder[0].vorname"],
        "kinder-1": ["kinder[1].vorname"],
      },
    });
  });

  it("should exclude certain sections", () => {
    const result = groupFieldsByFlowNavigation(
      ["field1"],
      mockFlowController as any,
      {
        field1: "/beratungshilfe/antrag/zusammenfassung/step",
      },
      mockTranslations,
      "/beratungshilfe/antrag",
    );

    // zusammenfassung should be excluded
    expect(result.groups).toEqual({});
  });
});

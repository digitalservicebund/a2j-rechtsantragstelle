import { describe, it, expect } from "vitest";
import { groupFieldsByFlowNavigation } from "../groupFieldsBySection";

describe("groupFieldsBySection", () => {
  const mockFlowController = {
    stepStates: () => [
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
          { stepId: "/finanzielle-angaben/kinder", subStates: [] },
        ],
      },
    ],
  };

  const mockFieldToStepMapping = {
    vorname: "/beratungshilfe/antrag/persoenliche-daten/name",
    nachname: "/beratungshilfe/antrag/persoenliche-daten/name",
    einkommen: "/beratungshilfe/antrag/finanzielle-angaben/einkommen/einkommen",
    "kinder#vorname":
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
  };

  const mockTranslations = {
    "/persoenliche-daten": "Persönliche Daten",
    "/finanzielle-angaben": "Finanzielle Angaben",
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
      "persoenliche-daten": "Persönliche Daten",
      "finanzielle-angaben": "Finanzielle Angaben",
    });
  });

  it("should group array fields by base field and index", () => {
    const result = groupFieldsByFlowNavigation(
      ["kinder[0].vorname", "kinder[1].vorname"],
      mockFlowController as any,
      {
        "kinder#vorname":
          "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/name",
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
    const excludedFlowController = {
      stepStates: () => [
        {
          stepId: "/zusammenfassung",
          subStates: [{ stepId: "/zusammenfassung/step", subStates: [] }],
        },
      ],
    };

    const result = groupFieldsByFlowNavigation(
      ["vorname"],
      excludedFlowController as any,
      {
        vorname: "/beratungshilfe/antrag/zusammenfassung/step",
      },
      mockTranslations,
      "/beratungshilfe/antrag",
    );

    expect(result.groups).toEqual({});
  });
});

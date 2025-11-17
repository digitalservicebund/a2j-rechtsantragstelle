import { describe, it, expect } from "vitest";
import { groupFieldsByFlowNavigation } from "../groupFieldsBySection";
import { StepState } from "~/services/flow/server/buildFlowController";

describe("groupFieldsBySection", () => {
  const mockStepStates: StepState[] = [
    {
      stepId: "/persoenliche-daten",
      isDone: false,
      isReachable: true,
      url: "/persoenliche-daten",
      subStates: [
        {
          stepId: "name",
          url: "/persoenliche-daten/name",
          subStates: [],
          isDone: false,
          isReachable: true,
        },
        {
          stepId: "geburtsdatum",
          url: "/persoenliche-daten/geburtsdatum",
          subStates: [],
          isDone: false,
          isReachable: true,
        },
      ],
    },
    {
      stepId: "/finanzielle-angaben",
      isDone: false,
      isReachable: true,
      url: "/finanzielle-angaben",
      subStates: [
        {
          stepId: "einkommen",
          url: "/finanzielle-angaben/einkommen",
          subStates: [],
          isDone: true,
          isReachable: true,
        },
        {
          stepId: "kinder",
          url: "/finanzielle-angaben/kinder",
          subStates: [],
          isDone: true,
          isReachable: true,
        },
      ],
    },
  ];

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
      mockStepStates,
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
      mockStepStates,
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
    const result = groupFieldsByFlowNavigation(
      ["vorname"],
      mockStepStates,
      {
        vorname: "/beratungshilfe/antrag/zusammenfassung/step",
      },
      mockTranslations,
      "/beratungshilfe/antrag",
    );

    expect(result.groups).toEqual({});
  });
});

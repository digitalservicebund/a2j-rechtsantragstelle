import { describe, it, expect } from "vitest";
import {
  createStepToSectionMapping,
  getSectionFromStepId,
  addFieldToGroup,
} from "../sectionMapping";

type StepState = {
  stepId: string;
  subStates?: StepState[];
  isDone: boolean;
  isReachable: boolean;
  url: string;
};

describe("sectionMapping", () => {
  describe("createStepToSectionMapping", () => {
    it("should create mapping for nested step states", () => {
      const stepStates: StepState[] = [
        {
          stepId: "/persoenliche-daten",
          isDone: false,
          isReachable: true,
          url: "/persoenliche-daten",
          subStates: [
            {
              stepId: "/persoenliche-daten/name",
              isDone: false,
              isReachable: true,
              url: "/persoenliche-daten/name",
              subStates: [],
            },
            {
              stepId: "/persoenliche-daten/geburtsdatum",
              isDone: false,
              isReachable: true,
              url: "/persoenliche-daten/geburtsdatum",
              subStates: [],
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
              stepId: "/finanzielle-angaben/einkommen",
              isDone: false,
              isReachable: true,
              url: "/finanzielle-angaben/einkommen",
              subStates: [],
            },
          ],
        },
      ];

      const result = createStepToSectionMapping(stepStates);

      expect(result).toEqual({
        "/persoenliche-daten/name": {
          sectionKey: "/persoenliche-daten",
          sectionTitle: "/persoenliche-daten",
        },
        "/persoenliche-daten/geburtsdatum": {
          sectionKey: "/persoenliche-daten",
          sectionTitle: "/persoenliche-daten",
        },
        "/finanzielle-angaben/einkommen": {
          sectionKey: "/finanzielle-angaben",
          sectionTitle: "/finanzielle-angaben",
        },
      });
    });

    it("should handle leaf steps without substates", () => {
      const stepStates: StepState[] = [
        {
          stepId: "/simple-step",
          isDone: false,
          isReachable: true,
          url: "/simple-step",
          subStates: [],
        },
      ];

      const result = createStepToSectionMapping(stepStates);

      expect(result).toEqual({
        "/simple-step": {
          sectionKey: "/simple-step",
          sectionTitle: "/simple-step",
        },
      });
    });

    it("should handle deeply nested step states", () => {
      const stepStates: StepState[] = [
        {
          stepId: "/main-section",
          isDone: false,
          isReachable: true,
          url: "/main-section",
          subStates: [
            {
              stepId: "/main-section/sub-section",
              isDone: false,
              isReachable: true,
              url: "/main-section/sub-section",
              subStates: [
                {
                  stepId: "/main-section/sub-section/final-step",
                  isDone: false,
                  isReachable: true,
                  url: "/main-section/sub-section/final-step",
                  subStates: [],
                },
              ],
            },
          ],
        },
      ];

      const result = createStepToSectionMapping(stepStates);

      expect(result).toEqual({
        "/main-section/sub-section/final-step": {
          sectionKey: "/main-section/sub-section",
          sectionTitle: "/main-section/sub-section",
        },
      });
    });

    it("should handle empty step states", () => {
      const stepStates: StepState[] = [];

      const result = createStepToSectionMapping(stepStates);

      expect(result).toEqual({});
    });
  });

  describe("getSectionFromStepId", () => {
    const stepToSectionMapping = {
      "/persoenliche-daten/name": {
        sectionKey: "/persoenliche-daten",
        sectionTitle: "Persönliche Daten",
      },
      "/persoenliche-daten/geburtsdatum": {
        sectionKey: "/persoenliche-daten",
        sectionTitle: "Persönliche Daten",
      },
      "/finanzielle-angaben/einkommen": {
        sectionKey: "/finanzielle-angaben",
        sectionTitle: "Finanzielle Angaben",
      },
      "/finanzielle-angaben/eigentum/bankkonten": {
        sectionKey: "/finanzielle-angaben",
        sectionTitle: "Finanzielle Angaben",
      },
    };

    it("should find exact match in mapping", () => {
      const result = getSectionFromStepId(
        "/persoenliche-daten/name",
        stepToSectionMapping,
      );

      expect(result).toEqual({
        sectionKey: "/persoenliche-daten",
        sectionTitle: "Persönliche Daten",
        boxKey: "name",
      });
    });

    it("should find partial match by removing path segments", () => {
      const result = getSectionFromStepId(
        "/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
        stepToSectionMapping,
      );

      expect(result).toEqual({
        sectionKey: "/finanzielle-angaben",
        sectionTitle: "Finanzielle Angaben",
        boxKey: "daten",
      });
    });

    it("should fallback to default when no match found", () => {
      const result = getSectionFromStepId(
        "/unknown/section/step",
        stepToSectionMapping,
      );

      expect(result).toEqual({
        sectionKey: "unknown",
        sectionTitle: "unknown",
        boxKey: "step",
      });
    });

    it("should handle root level stepId", () => {
      const result = getSectionFromStepId("/root", stepToSectionMapping);

      expect(result).toEqual({
        sectionKey: "root",
        sectionTitle: "root",
        boxKey: "root",
      });
    });

    it("should handle empty stepId", () => {
      const result = getSectionFromStepId("", stepToSectionMapping);

      expect(result).toEqual({
        sectionKey: "other",
        sectionTitle: "Zusätzliche Angaben",
        boxKey: "default",
      });
    });

    it("should handle stepId without leading slash", () => {
      const result = getSectionFromStepId(
        "persoenliche-daten/name",
        stepToSectionMapping,
      );

      expect(result).toEqual({
        sectionKey: "name",
        sectionTitle: "name",
        boxKey: "name",
      });
    });
  });

  describe("addFieldToGroup", () => {
    it("should add field to new group and section", () => {
      const groups: Record<string, Record<string, string[]>> = {};

      addFieldToGroup(groups, "persoenliche-daten", "name", "vorname");

      expect(groups).toEqual({
        "persoenliche-daten": {
          name: ["vorname"],
        },
      });
    });

    it("should add field to existing section and new box", () => {
      const groups: Record<string, Record<string, string[]>> = {
        "persoenliche-daten": {
          name: ["vorname"],
        },
      };

      addFieldToGroup(
        groups,
        "persoenliche-daten",
        "geburtsdatum",
        "geburtsdatum",
      );

      expect(groups).toEqual({
        "persoenliche-daten": {
          name: ["vorname"],
          geburtsdatum: ["geburtsdatum"],
        },
      });
    });

    it("should add field to existing section and box", () => {
      const groups: Record<string, Record<string, string[]>> = {
        "persoenliche-daten": {
          name: ["vorname"],
        },
      };

      addFieldToGroup(groups, "persoenliche-daten", "name", "nachname");

      expect(groups).toEqual({
        "persoenliche-daten": {
          name: ["vorname", "nachname"],
        },
      });
    });

    it("should handle multiple sections", () => {
      const groups: Record<string, Record<string, string[]>> = {
        "persoenliche-daten": {
          name: ["vorname"],
        },
      };

      addFieldToGroup(groups, "finanzielle-angaben", "einkommen", "gehalt");

      expect(groups).toEqual({
        "persoenliche-daten": {
          name: ["vorname"],
        },
        "finanzielle-angaben": {
          einkommen: ["gehalt"],
        },
      });
    });

    it("should handle array field box keys", () => {
      const groups: Record<string, Record<string, string[]>> = {};

      addFieldToGroup(
        groups,
        "finanzielle-angaben",
        "kinder-0",
        "kinder[0].vorname",
      );
      addFieldToGroup(
        groups,
        "finanzielle-angaben",
        "kinder-0",
        "kinder[0].nachname",
      );

      expect(groups).toEqual({
        "finanzielle-angaben": {
          "kinder-0": ["kinder[0].vorname", "kinder[0].nachname"],
        },
      });
    });

    it("should handle complex grouping", () => {
      const groups: Record<string, Record<string, string[]>> = {};

      addFieldToGroup(groups, "persoenliche-daten", "name", "vorname");
      addFieldToGroup(groups, "persoenliche-daten", "name", "nachname");
      addFieldToGroup(
        groups,
        "persoenliche-daten",
        "geburtsdatum",
        "geburtsdatum",
      );

      addFieldToGroup(groups, "finanzielle-angaben", "einkommen", "gehalt");
      addFieldToGroup(groups, "finanzielle-angaben", "eigentum", "bankkonten");

      addFieldToGroup(
        groups,
        "finanzielle-angaben",
        "kinder-0",
        "kinder[0].vorname",
      );
      addFieldToGroup(
        groups,
        "finanzielle-angaben",
        "kinder-1",
        "kinder[1].vorname",
      );

      expect(groups).toEqual({
        "persoenliche-daten": {
          name: ["vorname", "nachname"],
          geburtsdatum: ["geburtsdatum"],
        },
        "finanzielle-angaben": {
          einkommen: ["gehalt"],
          eigentum: ["bankkonten"],
          "kinder-0": ["kinder[0].vorname"],
          "kinder-1": ["kinder[1].vorname"],
        },
      });
    });
  });
});

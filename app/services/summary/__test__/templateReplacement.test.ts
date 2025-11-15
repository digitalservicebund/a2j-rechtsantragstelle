import { describe, it, expect } from "vitest";
import { getUserDataFieldLabel } from "../templateReplacement";
import type { UserData } from "~/domains/userData";

describe("templateReplacement", () => {
  describe("getUserDataFieldLabel", () => {
    it("should return field name when no question available", () => {
      const fieldQuestions = {};

      const result = getUserDataFieldLabel("vorname", fieldQuestions);

      expect(result).toBe("vorname");
    });

    describe("kinder template replacement", () => {
      const userData: UserData = {
        kinder: [
          {
            vorname: "Max",
            nachname: "Müller",
            geburtsdatum: "01.01.2010",
          },
          {
            vorname: "Anna",
            nachname: "Schmidt",
            geburtsdatum: "15.06.2015",
          },
        ],
      };

      it("should replace {{kind#vorname}} with actual child name", () => {
        const fieldQuestions = {
          "kinder[0].eigeneEinnahmen": {
            question: "Hat {{kind#vorname}} eigene Einnahmen?",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[0].eigeneEinnahmen",
          fieldQuestions,
          userData,
        );

        expect(result).toBe("Hat Max eigene Einnahmen?");
      });

      it("should replace multiple variables in one question", () => {
        const fieldQuestions = {
          "kinder[0].vorname": {
            question: "Wie heißt {{kind#vorname}} {{kind#nachname}}?",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[0].vorname",
          fieldQuestions,
          userData,
        );

        expect(result).toBe("Wie heißt Max Müller?");
      });

      it("should handle different array indices correctly", () => {
        const fieldQuestions = {
          "kinder[1].wohnortBeiAntragsteller": {
            question: "Lebt {{kinder#vorname}} bei Ihnen?",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[1].wohnortBeiAntragsteller",
          fieldQuestions,
          userData,
        );

        expect(result).toBe("Lebt Anna bei Ihnen?");
      });
    });

    describe("edge cases", () => {
      it("should keep original template when userData is not provided", () => {
        const fieldQuestions = {
          "kinder[0].vorname": {
            question: "Wie heißt {{kind#vorname}}?",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[0].vorname",
          fieldQuestions,
          undefined,
        );

        expect(result).toBe("Wie heißt {{kind#vorname}}?");
      });

      it("should keep original template when kinder array is missing", () => {
        const userData: UserData = {};

        const fieldQuestions = {
          "kinder[0].vorname": {
            question: "Wie heißt {{kind#vorname}}?",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[0].vorname",
          fieldQuestions,
          userData,
        );

        expect(result).toBe("Wie heißt {{kind#vorname}}?");
      });

      it("should keep original template when array index is out of bounds", () => {
        const userData: UserData = {
          kinder: [{ vorname: "Max" }],
        };

        const fieldQuestions = {
          "kinder[5].vorname": {
            question: "Wie heißt {{kind#vorname}}?",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[5].vorname",
          fieldQuestions,
          userData,
        );

        expect(result).toBe("Wie heißt {{kind#vorname}}?");
      });

      it("should keep original template when field doesn't exist in child data", () => {
        const userData: UserData = {
          kinder: [{ vorname: "Max" }], // Missing nachname
        };

        const fieldQuestions = {
          "kinder[0].test": {
            question: "Test {{kind#nachname}} question",
          },
        };

        const result = getUserDataFieldLabel(
          "kinder[0].test",
          fieldQuestions,
          userData,
        );

        expect(result).toBe("Test {{kind#nachname}} question");
      });
    });
  });
});

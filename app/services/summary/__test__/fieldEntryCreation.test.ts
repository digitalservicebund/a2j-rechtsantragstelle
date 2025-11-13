import { describe, it, expect } from "vitest";
import { createFieldEntry, processBoxFields } from "../fieldEntryCreation";
import type { UserData } from "~/domains/userData";

describe("fieldEntryCreation", () => {
  describe("createFieldEntry", () => {
    const mockFieldQuestions = {
      vorname: { question: "Wie ist Ihr Vorname?" },
      "kinder[0].vorname": { question: "Wie heißt das Kind?" },
      berufart: {
        question: "Welche Berufsart haben Sie?",
        options: [
          { text: "Angestellt", value: "festangestellt" },
          { text: "Selbstständig", value: "selbststaendig" },
        ],
      },
    };

    it("should create field entry for regular field", () => {
      const userData: UserData = { vorname: "Max" };

      const result = createFieldEntry(
        "vorname",
        userData,
        mockFieldQuestions,
        "/step",
      );

      expect(result).toEqual(
        expect.objectContaining({
          question: "Wie ist Ihr Vorname?",
          answer: "Max",
          editUrl: "/step",
          isArrayItem: false,
          arrayIndex: undefined,
          arrayBaseField: undefined,
        }),
      );
    });

    it("should create field entry for empty field", () => {
      const userData: UserData = { vorname: "" };

      const result = createFieldEntry(
        "vorname",
        userData,
        mockFieldQuestions,
        "/step",
      );

      expect(result).toEqual(
        expect.objectContaining({
          question: "Wie ist Ihr Vorname?",
          answer: "Keine Angabe",
          editUrl: "/step",
          isArrayItem: false,
          arrayIndex: undefined,
          arrayBaseField: undefined,
        }),
      );
    });

    it("should create field entry for array sub-field", () => {
      const userData: UserData = {
        kinder: [{ vorname: "Anna", nachname: "Schmidt" }],
      };

      const result = createFieldEntry(
        "kinder[0].vorname",
        userData,
        mockFieldQuestions,
        "/kinder/step",
      );

      expect(result).toEqual(
        expect.objectContaining({
          question: "Wie heißt das Kind?",
          answer: "Anna",
          editUrl: "/kinder/uebersicht",
          isArrayItem: true,
          arrayIndex: 0,
          arrayBaseField: "kinder",
        }),
      );
    });

    it("should handle field with options", () => {
      const userData: UserData = {
        berufart: { festangestellt: "on", selbststaendig: "off" },
      };

      const result = createFieldEntry(
        "berufart",
        userData,
        mockFieldQuestions,
        "/step",
      );

      expect(result.question).toBe("Welche Berufsart haben Sie?");
      expect(result.answer).toBe("Angestellt");
      expect(result.editUrl).toBe("/step");
    });

    it("should fallback to field name when no question found", () => {
      const userData: UserData = { unknownField: "value" };

      const result = createFieldEntry("unknownField", userData, {}, "/step");

      expect(result.question).toBe("unknownField");
      expect(result.answer).toBe("value");
    });
  });

  describe("processBoxFields", () => {
    const mockFieldQuestions = {
      vorname: { question: "Vorname?" },
      nachname: { question: "Nachname?" },
    };

    const mockFieldToStepMapping = {
      vorname: "/persoenliche-daten/name",
      nachname: "/persoenliche-daten/name",
      unknownField: "/unknown/step",
    };

    it("should process multiple fields", () => {
      const userData: UserData = {
        vorname: "Max",
        nachname: "Mustermann",
      };

      const result = processBoxFields(
        ["vorname", "nachname"],
        userData,
        mockFieldQuestions,
        mockFieldToStepMapping,
        "/beratungshilfe/antrag",
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          question: "Vorname?",
          answer: "Max",
          editUrl: "/beratungshilfe/antrag/persoenliche-daten/name",
          isArrayItem: false,
          arrayIndex: undefined,
          arrayBaseField: undefined,
        }),
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          question: "Nachname?",
          answer: "Mustermann",
          editUrl: "/beratungshilfe/antrag/persoenliche-daten/name",
          isArrayItem: false,
          arrayIndex: undefined,
          arrayBaseField: undefined,
        }),
      );
    });

    it("should handle array fields", () => {
      const userData: UserData = {
        kinder: [{ vorname: "Anna" }],
      };

      const arrayFieldToStepMapping = {
        "kinder[0].vorname": "/kinder/name",
      };

      const arrayFieldQuestions = {
        "kinder[0].vorname": { question: "Kindername?" },
      };

      const result = processBoxFields(
        ["kinder[0].vorname"],
        userData,
        arrayFieldQuestions,
        arrayFieldToStepMapping,
        "/beratungshilfe/antrag",
      );

      expect(result).toHaveLength(1);
      expect(result[0].question).toBe("Kindername?");
      expect(result[0].answer).toBe("Anna");
    });
  });
});

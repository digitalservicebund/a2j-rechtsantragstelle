import { describe, it, expect } from "vitest";
import {
  groupFieldsByArrayType,
  createArrayGroupItems,
  buildArrayGroups,
} from "../arrayGrouping";
import type { FieldItem } from "../types";
import type { Translations } from "~/services/translations/getTranslationByKey";

describe("arrayGrouping", () => {
  describe("groupFieldsByArrayType", () => {
    it("should separate array fields from non-array fields", () => {
      const mockFields: FieldItem[] = [
        {
          id: "field1",
          question: "Haben Sie Kinder?",
          answer: "yes",
          editUrl: "/finanzielle-angaben/kinder/frage",
          isArrayItem: false,
        },
        {
          id: "field2",
          question: "Wie heißt Ihr Kind?",
          answer: "wgre",
          editUrl: "/finanzielle-angaben/kinder/kinder/name",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 0,
        },
        {
          id: "field3",
          question: "Wann wurde Ihr Kind geboren?",
          answer: "11.11.2009",
          editUrl: "/finanzielle-angaben/kinder/kinder/geburtsdatum",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 0,
        },
        {
          id: "field4",
          question: "Wie heißt Ihr Kind?",
          answer: "kind2",
          editUrl: "/finanzielle-angaben/kinder/kinder/name",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 1,
        },
        {
          id: "field5",
          question: "Haben Sie ein Bankkonto?",
          answer: "yes",
          editUrl: "/finanzielle-angaben/bankkonten/frage",
          isArrayItem: false,
        },
      ];

      const result = groupFieldsByArrayType(mockFields);

      expect(result.nonArrayFields).toHaveLength(2);
      expect(result.nonArrayFields[0].question).toBe("Haben Sie Kinder?");
      expect(result.nonArrayFields[1].question).toBe(
        "Haben Sie ein Bankkonto?",
      );

      expect(result.arrayFieldsByBase).toHaveProperty("kinder");
      expect(result.arrayFieldsByBase.kinder).toHaveProperty("kinder-0");
      expect(result.arrayFieldsByBase.kinder).toHaveProperty("kinder-1");
      expect(result.arrayFieldsByBase.kinder["kinder-0"]).toHaveLength(2);
      expect(result.arrayFieldsByBase.kinder["kinder-1"]).toHaveLength(1);
    });

    it("should handle fields without array properties", () => {
      const mockFields: FieldItem[] = [
        {
          id: "field1",
          question: "Regular field",
          answer: "Answer1",
          editUrl: "/page1",
          isArrayItem: false,
        },
      ];

      const result = groupFieldsByArrayType(mockFields);

      expect(result.nonArrayFields).toHaveLength(1);
      expect(result.arrayFieldsByBase).toEqual({});
    });
  });

  describe("createArrayGroupItems", () => {
    it("should create array group item from multiple fields", () => {
      const mockGroupFields: FieldItem[] = [
        {
          id: "field1",
          question: "Wie heißt Ihr Kind mit Vornamen?",
          answer: "wgre",
          editUrl: "/finanzielle-angaben/kinder/kinder/name",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 0,
        },
        {
          id: "field2",
          question: "Wie heißt Ihr Kind mit Nachnamen?",
          answer: "gwergwerg",
          editUrl: "/finanzielle-angaben/kinder/kinder/name",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 0,
        },
        {
          id: "field3",
          question: "Wann wurde Ihr Kind geboren?",
          answer: "11.11.2009",
          editUrl: "/finanzielle-angaben/kinder/kinder/geburtsdatum",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 0,
        },
        {
          id: "field4",
          question: "Lebt Ihr Kind bei Ihnen?",
          answer: "partially",
          editUrl: "/finanzielle-angaben/kinder/kinder/wohnort",
          isArrayItem: true,
          arrayBaseField: "kinder",
          arrayIndex: 0,
        },
      ];

      const result = createArrayGroupItems(mockGroupFields);

      expect(result).not.toBeNull();
      expect(result!.question).toBe("");
      expect(result!.answer).toBe("");
      expect(result!.editUrl).toBe("/finanzielle-angaben/kinder/kinder/name");
      expect(result!.multipleQuestions).toHaveLength(4);
      expect(result!.multipleQuestions![0].question).toBe(
        "Wie heißt Ihr Kind mit Vornamen?",
      );
      expect(result!.multipleQuestions![0].answer).toBe("wgre");
      expect(result!.multipleQuestions![1].question).toBe(
        "Wie heißt Ihr Kind mit Nachnamen?",
      );
      expect(result!.multipleQuestions![1].answer).toBe("gwergwerg");
      expect(result!.multipleQuestions![2].answer).toBe("11.11.2009");
      expect(result!.multipleQuestions![3].answer).toBe("partially");
    });

    it("should return null for empty group", () => {
      const result = createArrayGroupItems([]);
      expect(result).toBeNull();
    });
  });

  describe("buildArrayGroups", () => {
    it("should build array groups with translations", () => {
      const mockArrayFieldsByBase = {
        kinder: {
          "kinder-0": [
            {
              id: "field1",
              question: "Wie heißt Ihr Kind?",
              answer: "wgre",
              editUrl: "/finanzielle-angaben/kinder/kinder/name",
              isArrayItem: true,
              arrayBaseField: "kinder",
              arrayIndex: 0,
            },
          ],
          "kinder-1": [
            {
              id: "field2",
              question: "Wie heißt Ihr Kind?",
              answer: "kind2",
              editUrl: "/finanzielle-angaben/kinder/kinder/name",
              isArrayItem: true,
              arrayBaseField: "kinder",
              arrayIndex: 1,
            },
          ],
        },
        geldanlagen: {
          "geldanlagen-0": [
            {
              id: "field3",
              question: "Welche Art der Geldanlage haben Sie?",
              answer: "bargeld",
              editUrl: "/finanzielle-angaben/geldanlagen/geldanlagen/art",
              isArrayItem: true,
              arrayBaseField: "geldanlagen",
              arrayIndex: 0,
            },
          ],
        },
      };

      const mockTranslations: Translations = {
        kinder: "Kinder",
        geldanlagen: "Geldanlagen",
      };

      const result = buildArrayGroups(mockArrayFieldsByBase, mockTranslations);

      expect(result).toHaveLength(2);

      const kinderGroup = result.find((group) => group.id === "kinder");
      expect(kinderGroup?.title).toBe("Kinder");
      expect(kinderGroup?.items).toHaveLength(2);

      const geldanlagenGroup = result.find(
        (group) => group.id === "geldanlagen",
      );
      expect(geldanlagenGroup?.title).toBe("Geldanlagen");
      expect(geldanlagenGroup?.items).toHaveLength(1);
    });

    it("should use fallback titles when no translations provided", () => {
      const mockArrayFieldsByBase = {
        bankkonten: {
          "bankkonten-0": [
            {
              id: "field1",
              question: "Bei welcher Bank haben Sie ein Konto?",
              answer: "ewgwergewr",
              editUrl: "/finanzielle-angaben/bankkonten/bankkonten/bank",
              isArrayItem: true,
              arrayBaseField: "bankkonten",
              arrayIndex: 0,
            },
          ],
        },
      };

      const result = buildArrayGroups(mockArrayFieldsByBase);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Bankkonten"); // Capitalized fallback
    });

    it("should filter out empty groups", () => {
      const mockArrayFieldsByBase = {
        emptyGroup: {},
      };

      const result = buildArrayGroups(mockArrayFieldsByBase);

      expect(result).toHaveLength(0);
    });
  });
});

import { describe, it, expect } from "vitest";
import { parseArrayField, createArrayBoxKey } from "../fieldParsingUtils";

describe("fieldParsingUtils", () => {
  describe("parseArrayField", () => {
    it("should parse regular field names", () => {
      const result = parseArrayField("vorname");
      expect(result).toEqual({
        baseFieldName: "vorname",
        arrayIndex: -1,
        isArrayField: false,
        isArraySubField: false,
      });
    });

    it("should parse simple array fields", () => {
      const result = parseArrayField("kinder[0]");
      expect(result).toEqual({
        baseFieldName: "kinder",
        arrayIndex: 0,
        isArrayField: true,
        isArraySubField: false,
      });
    });

    it("should parse array sub-fields", () => {
      const result = parseArrayField("kinder[0].vorname");
      expect(result).toEqual({
        baseFieldName: "kinder",
        arrayIndex: 0,
        subFieldName: "vorname",
        isArrayField: true,
        isArraySubField: true,
      });
    });

    it("should handle different array indices", () => {
      const result = parseArrayField("bankkonten[5].inhaber");
      expect(result).toEqual({
        baseFieldName: "bankkonten",
        arrayIndex: 5,
        subFieldName: "inhaber",
        isArrayField: true,
        isArraySubField: true,
      });
    });
  });

  describe("createArrayBoxKey", () => {
    it("should create box keys for array fields", () => {
      expect(createArrayBoxKey("kinder[0]")).toBe("kinder-0");
      expect(createArrayBoxKey("kinder[0].vorname")).toBe("kinder-0");
      expect(createArrayBoxKey("bankkonten[3].inhaber")).toBe("bankkonten-3");
    });

    it("should return null for non-array fields", () => {
      expect(createArrayBoxKey("vorname")).toBeNull();
      expect(createArrayBoxKey("arbeitsplatz.strasse")).toBeNull();
    });
  });
});

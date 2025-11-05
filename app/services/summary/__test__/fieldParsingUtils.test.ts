import { describe, it, expect } from "vitest";
import {
  parseArrayField,
  createArrayFieldKey,
  createArrayBoxKey,
  isArrayField,
  isArraySubField,
} from "../fieldParsingUtils";

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

  describe("createArrayFieldKey", () => {
    it("should convert array sub-fields to hash notation", () => {
      expect(createArrayFieldKey("kinder[0].vorname")).toBe("kinder#vorname");
      expect(createArrayFieldKey("bankkonten[1].inhaber")).toBe(
        "bankkonten#inhaber",
      );
    });

    it("should return original field name for non-array-sub-fields", () => {
      expect(createArrayFieldKey("vorname")).toBe("vorname");
      expect(createArrayFieldKey("kinder[0]")).toBe("kinder[0]");
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

  describe("isArrayField", () => {
    it("should detect array fields", () => {
      expect(isArrayField("kinder[0]")).toBe(true);
      expect(isArrayField("kinder[0].vorname")).toBe(true);
      expect(isArrayField("vorname")).toBe(false);
    });
  });

  describe("isArraySubField", () => {
    it("should detect array sub-fields", () => {
      expect(isArraySubField("kinder[0].vorname")).toBe(true);
      expect(isArraySubField("kinder[0]")).toBe(false);
      expect(isArraySubField("vorname")).toBe(false);
    });
  });
});

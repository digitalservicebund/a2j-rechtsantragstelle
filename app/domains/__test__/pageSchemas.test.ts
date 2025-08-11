import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { getPageSchema, xStateTargetsFromPagesConfig } from "../pageSchemas";

describe("getPageSchema", () => {
  it("should return the page schema for the current step", () => {
    expect(
      getPageSchema("/beratungshilfe/vorabcheck/rechtsschutzversicherung"),
    ).toStrictEqual({ rechtsschutzversicherung: YesNoAnswer });
  });

  it("should return undefined if no page schema is found", () => {
    expect(getPageSchema("/step-does-not-exist")).toBeUndefined();
  });

  describe("array pages", () => {
    it("should handle simple array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/einnahme/0/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle nested array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/eigentum-zusammenfassung/geldanlagen/0/art",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("art");
    });

    it("should handle deeply nested array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/eigentum-zusammenfassung/geldanlagen/0/bargeld",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("bargeld");
    });

    it("should handle different array indexes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/einnahme/5/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should return undefined for non-existent array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/einnahme/0/non-existent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-existent nested array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/eigentum-zusammenfassung/geldanlagen/0/non-existent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined for pages without arrayPages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/simple-page/0/field",
      );
      expect(result).toBeUndefined();
    });

    it("should handle multiple array indexes in the path", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/einnahme/0/daten/1/subfield",
      );
      expect(result).toBeUndefined(); // This should return undefined as it's not a valid path structure
    });

    it("should handle nested array with different array indexes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/eigentum-zusammenfassung/geldanlagen/42/art",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("art");
    });

    it("should handle nested array with large array indexes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/eigentum-zusammenfassung/geldanlagen/999/bargeld",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("bargeld");
    });

    it("should return undefined for invalid nested path structure", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/eigentum-zusammenfassung/invalid/0/art",
      );
      expect(result).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle empty pathname", () => {
      expect(getPageSchema("")).toBeUndefined();
    });

    it("should handle pathname with only flow ID", () => {
      expect(getPageSchema("/prozesskostenhilfe/formular")).toBeUndefined();
    });

    it("should handle pathname with trailing slash", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/einnahme/0/daten/",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle pathname with multiple consecutive slashes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular//einnahme//0//daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle pathname with only slashes", () => {
      expect(getPageSchema("///")).toBeUndefined();
    });

    it("should handle pathname with mixed valid and invalid parts", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/einnahme/0/daten/invalid",
      );
      expect(result).toBeUndefined();
    });
  });
});

describe("xStateTargetsFromPageSchema", () => {
  it("should map a PagesConfig to its equivalent xState targets", () => {
    const pagesConfig = {
      testPage: {
        stepId: "parent/child/target",
        pageSchema: {
          testField: stringRequiredSchema,
        },
      },
    };
    expect(xStateTargetsFromPagesConfig(pagesConfig)).toStrictEqual({
      testPage: {
        absolute: "#parent.child.target",
        relative: "target",
      },
    });
  });
});

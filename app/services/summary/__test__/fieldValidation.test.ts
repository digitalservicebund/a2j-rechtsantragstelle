import { describe, it, expect } from "vitest";
import { getValidUserDataFields } from "../fieldValidation";
import type { UserData } from "~/domains/userData";

describe("fieldValidation", () => {
  describe("getValidUserDataFields", () => {
    it("should exclude pageData field", () => {
      const userData: UserData = {
        pageData: "should be excluded",
        vorname: "Max",
      };
      const result = getValidUserDataFields(userData);
      expect(result).toEqual(["vorname"]);
      expect(result).not.toContain("pageData");
    });

    it("should include simple string fields", () => {
      const userData: UserData = {
        vorname: "Max",
        nachname: "Mustermann",
      };
      const result = getValidUserDataFields(userData);
      expect(result).toContain("vorname");
      expect(result).toContain("nachname");
    });

    it("should expand nested object fields", () => {
      const userData: UserData = {
        berufart: {
          selbststaendig: "on",
          festangestellt: "off",
        },
      };
      const result = getValidUserDataFields(userData);
      expect(result).toContain("berufart");
      expect(result).toContain("berufart.selbststaendig");
      expect(result).toContain("berufart.festangestellt");
    });

    it("should handle complex nested objects", () => {
      const userData: UserData = {
        arbeitsplatz: {
          strasseHausnummer: "Alexandrinenstr. 13",
          plz: "10999",
          ort: "Berlin",
        },
      };
      const result = getValidUserDataFields(userData);
      expect(result).toContain("arbeitsplatz");
      expect(result).toContain("arbeitsplatz.strasseHausnummer");
      expect(result).toContain("arbeitsplatz.plz");
      expect(result).toContain("arbeitsplatz.ort");
    });

    it("should handle mixed data structure", () => {
      const userData: UserData = {
        vorname: "Max",
        nachname: "Mustermann",
        geburtsdatum: { day: "15", month: "01", year: "1990" },
        berufart: {
          selbststaendig: "on",
          festangestellt: "off",
        },
        einkommen: "1500",
        kinder: [
          {
            vorname: "Anna",
            nachname: "Schmidt",
            geburtsdatum: "10.06.2015",
          },
        ],
        pageData: "internal state",
      };

      const result = getValidUserDataFields(userData);

      // Should include all fields except pageData
      expect(result).toContain("vorname");
      expect(result).toContain("nachname");
      expect(result).toContain("geburtsdatum"); // Date object not expanded
      expect(result).toContain("einkommen");
      expect(result).toContain("kinder"); // Array not expanded
      expect(result).not.toContain("pageData");

      expect(result).toContain("berufart");
      expect(result).toContain("berufart.selbststaendig");
      expect(result).toContain("berufart.festangestellt");

      expect(result).not.toContain("geburtsdatum.day");
      expect(result).not.toContain("kinder.0");
      expect(result).not.toContain("kinder[0].vorname");
    });
  });
});

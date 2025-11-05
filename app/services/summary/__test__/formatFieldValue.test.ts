import { describe, it, expect } from "vitest";
import { formatFieldValue } from "../formatFieldValue";

describe("formatFieldValue", () => {
  describe("Basic value formatting", () => {
    it("should format string values", () => {
      expect(formatFieldValue("test")).toBe("test");
      expect(formatFieldValue("")).toBe("");
    });

    it("should format number values", () => {
      expect(formatFieldValue(123)).toBe("123");
      expect(formatFieldValue(0)).toBe("0");
    });

    it("should format boolean values", () => {
      expect(formatFieldValue(true)).toBe("true");
      expect(formatFieldValue(false)).toBe("false");
    });

    it("should handle null and undefined", () => {
      expect(formatFieldValue(null)).toBe("");
      expect(formatFieldValue(undefined)).toBe("");
    });
  });

  describe("Option translation", () => {
    it("should translate values using provided options", () => {
      const options = [
        { text: "Ja", value: "yes" },
        { text: "Nein", value: "no" },
        { text: "Mutter", value: "mother" },
        { text: "Vater", value: "father" },
      ];

      expect(formatFieldValue("yes", options)).toBe("Ja");
      expect(formatFieldValue("no", options)).toBe("Nein");
      expect(formatFieldValue("mother", options)).toBe("Mutter");
      expect(formatFieldValue("father", options)).toBe("Vater");
    });

    it("should return original value if no matching option found", () => {
      const options = [
        { text: "Ja", value: "yes" },
        { text: "Nein", value: "no" },
      ];

      expect(formatFieldValue("unknown", options)).toBe("unknown");
    });

    it("should return original value if no options provided", () => {
      expect(formatFieldValue("yes")).toBe("yes");
      expect(formatFieldValue("mother")).toBe("mother");
    });
  });

  describe("Date object formatting", () => {
    it("should format date objects in DD.MM.YYYY format", () => {
      const dateObj = { day: 15, month: 6, year: 2023 };
      expect(formatFieldValue(dateObj)).toBe("15.06.2023");
    });

    it("should pad single digits with zeros", () => {
      const dateObj = { day: 5, month: 3, year: 2023 };
      expect(formatFieldValue(dateObj)).toBe("05.03.2023");
    });
  });

  describe("Boolean object formatting", () => {
    it("should format boolean objects with active keys", () => {
      const boolObj = { option1: true, option2: false, option3: "on" };
      expect(formatFieldValue(boolObj)).toBe("option1, option3");
    });

    it("should handle 'none' option", () => {
      const boolObj = { option1: true, none: true };
      expect(formatFieldValue(boolObj)).toBe("none");
    });

    it("should translate boolean objects using options", () => {
      const boolObj = { pregnancy: true, disability: false };
      const options = [
        { text: "Schwangerschaft", value: "pregnancy" },
        { text: "Behinderung", value: "disability" },
      ];

      expect(formatFieldValue(boolObj, options)).toBe("Schwangerschaft");
    });

    it("should handle 'none' with proper translation", () => {
      const boolObj = { pregnancy: false, none: true };
      const options = [
        { text: "Schwangerschaft", value: "pregnancy" },
        { text: "Nein, trifft nicht zu", value: "none" },
      ];

      expect(formatFieldValue(boolObj, options)).toBe("Nein, trifft nicht zu");
    });
  });
});

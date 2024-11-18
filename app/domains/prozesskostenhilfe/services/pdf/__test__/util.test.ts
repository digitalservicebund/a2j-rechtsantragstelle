import {
  getTotalMonthlyFinancialEntries,
  removeDecimalsFromCurrencyString,
} from "../util";

describe("utility functions", () => {
  describe("getTotalMonthlyFinancialEntries", () => {
    it("should return the total monthly arbeitsausgaben sum, given a list of arbeitsausgaben", () => {
      expect(
        getTotalMonthlyFinancialEntries([
          {
            beschreibung: "",
            betrag: "100,00",
            zahlungsfrequenz: "monthly",
          },
          {
            beschreibung: "",
            betrag: "120,00",
            zahlungsfrequenz: "one-time",
          },
          {
            beschreibung: "",
            betrag: "60,00",
            zahlungsfrequenz: "quarterly",
          },
          {
            beschreibung: "",
            betrag: "120,00",
            zahlungsfrequenz: "yearly",
          },
        ]),
      ).toBe("140,00");
    });
    it("should consider the thousands seperator", () => {
      expect(
        getTotalMonthlyFinancialEntries([
          {
            beschreibung: "",
            betrag: "1.000,00",
            zahlungsfrequenz: "monthly",
          },
          {
            beschreibung: "",
            betrag: "120,00",
            zahlungsfrequenz: "monthly",
          },
        ]),
      ).toBe("1.120,00");
    });
  });

  describe("removeDecimalsFromCurrencyString", () => {
    it("should remove decimals from a currency string", () => {
      const result = removeDecimalsFromCurrencyString("1.234,56");
      expect(result).toBe("1.234");
    });

    it("should return the same string if there are no decimals", () => {
      const result = removeDecimalsFromCurrencyString("1.234");
      expect(result).toBe("1.234");
    });

    it("should handle an empty string", () => {
      const result = removeDecimalsFromCurrencyString("");
      expect(result).toBe("");
    });

    it("should handle strings without currency values", () => {
      const result = removeDecimalsFromCurrencyString("Hello World");
      expect(result).toBe("Hello World");
    });
  });
});

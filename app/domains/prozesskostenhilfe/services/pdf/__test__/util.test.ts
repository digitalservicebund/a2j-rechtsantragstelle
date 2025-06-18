import {
  getFinancialEntryMonthlyAverage,
  getTotalMonthlyFinancialEntries,
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

  describe("getFinancialEntryMonthlyAverage", () => {
    it('should return the unmodified value when the frequence is "monthly"', () => {
      expect(
        getFinancialEntryMonthlyAverage({
          beschreibung: "",
          betrag: "100,00",
          zahlungsfrequenz: "monthly",
        }),
      ).toBe(100);
    });

    it('should return a third of the value when the frequence is "quarterly"', () => {
      expect(
        getFinancialEntryMonthlyAverage({
          beschreibung: "",
          betrag: "90,00",
          zahlungsfrequenz: "quarterly",
        }),
      ).toBe(30);
    });
    it('should return a twelth of the value when the frequence is "one-time" or "yearly"', () => {
      expect(
        getFinancialEntryMonthlyAverage({
          beschreibung: "",
          betrag: "120,00",
          zahlungsfrequenz: "yearly",
        }),
      ).toBe(10);
      expect(
        getFinancialEntryMonthlyAverage({
          beschreibung: "",
          betrag: "120,00",
          zahlungsfrequenz: "one-time",
        }),
      ).toBe(10);
    });
  });
});

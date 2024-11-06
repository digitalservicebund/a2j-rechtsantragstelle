import { getTotalMonthlyFinancialEntries } from "~/domains/prozesskostenhilfe/pdf/util";

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
});

import { addMonthlyAmount } from "~/flows/prozesskostenhilfeFormular";

describe("prozesskostenhilfeFormular utility functions", () => {
  describe("addMonthlyAmounts", () => {
    it("should add a monthly amount field to one-time expenses", () => {
      const entry = addMonthlyAmount({
        beschreibung: "Description",
        betrag: "100",
        zahlungsfrequenz: "one-time",
      });
      expect(entry.proMonat).toEqual("9€");
    });

    it("should add a monthly amount field to yearly expenses", () => {
      const entry = addMonthlyAmount({
        beschreibung: "Description",
        betrag: "100",
        zahlungsfrequenz: "yearly",
      });
      expect(entry.proMonat).toEqual("9€");
    });

    it("should add a monthly amount field to quarterly expenses", () => {
      const entry = addMonthlyAmount({
        beschreibung: "Description",
        betrag: "100",
        zahlungsfrequenz: "quarterly",
      });
      expect(entry.proMonat).toEqual("25€");
    });

    it("should not add a monthly amount field to a monthly expense", () => {
      const entry = addMonthlyAmount({
        beschreibung: "Description",
        betrag: "100",
        zahlungsfrequenz: "monthly",
      });
      expect(entry.proMonat).toBeUndefined();
    });
  });
});

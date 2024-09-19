import { createFinancialEntry } from "tests/fixtures/prozesskostenhilfeFormularData";
import { getTotalMonthlyFinancialEntries } from "~/services/pdf/util";

describe("utility functions", () => {
  describe("getTotalMonthlyFinancialEntries", () => {
    it("should return the total monthly arbeitsausgaben sum, given a list of arbeitsausgaben", () => {
      expect(
        getTotalMonthlyFinancialEntries([
          { ...createFinancialEntry(), betrag: "100" },
          { ...createFinancialEntry(), betrag: "120" },
          { ...createFinancialEntry(), betrag: "60" },
          { ...createFinancialEntry(), betrag: "120" },
        ]),
      ).toBe(400);
    });
  });
});

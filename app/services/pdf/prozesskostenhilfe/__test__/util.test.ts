import { faker } from "@faker-js/faker";
import type { FinancialEntry } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { getTotalMonthlyFinancialEntries } from "~/services/pdf/util";

describe("utility functions", () => {
  describe("getTotalMonthlyFinancialEntries", () => {
    it("should return the total monthly arbeitsausgaben sum, given a list of arbeitsausgaben", () => {
      const financialEntries: FinancialEntry[] = [
        {
          beschreibung: faker.word.words(),
          betrag: "100",
        },
        {
          beschreibung: faker.word.words(),
          betrag: "120",
        },
        {
          beschreibung: faker.word.words(),
          betrag: "60",
        },
        {
          beschreibung: faker.word.words(),
          betrag: "120",
        },
      ];
      expect(getTotalMonthlyFinancialEntries(financialEntries)).toBe(400);
    });
  });
});

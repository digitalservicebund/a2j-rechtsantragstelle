import { faker } from "@faker-js/faker";
import { getTotalMonthlyFinancialEntries } from "~/services/pdf/util";

describe("utility functions", () => {
  describe("getTotalMonthlyFinancialEntries", () => {
    it("should return the total monthly arbeitsausgaben sum, given a list of arbeitsausgaben", () => {
      expect(
        getTotalMonthlyFinancialEntries([
          { beschreibung: faker.word.words(), betrag: "100" },
          { beschreibung: faker.word.words(), betrag: "120" },
          { beschreibung: faker.word.words(), betrag: "60" },
          { beschreibung: faker.word.words(), betrag: "120" },
        ]),
      ).toBe(400);
    });
  });
});

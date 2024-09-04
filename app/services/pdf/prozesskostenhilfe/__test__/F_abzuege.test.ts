import { faker } from "@faker-js/faker";
import type { Arbeitsausgabe } from "~/services/pdf/prozesskostenhilfe/F_abzuege";
import { getTotalMonthlyArbeitsausgaben } from "~/services/pdf/prozesskostenhilfe/F_abzuege";

describe("F_abzuege", () => {
  describe("getTotalMonthlyArbeitsausgaben", () => {
    it("should return the total monthly arbeitsausgaben sum, given a list of arbeitsausgaben", () => {
      const arbeitsausgaben: Arbeitsausgabe[] = [
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
      expect(getTotalMonthlyArbeitsausgaben(arbeitsausgaben)).toBe(400);
    });
  });
});

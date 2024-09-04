import { faker } from "@faker-js/faker";
import type { Arbeitsausgabe } from "~/services/pdf/prozesskostenhilfe/F_abzuege";
import {
  getTotalMonthlyArbeitsausgaben,
  mapArbeitsausgabe,
} from "~/services/pdf/prozesskostenhilfe/F_abzuege";

describe("F_abzuege", () => {
  describe("mapArbeitsausgabe", () => {
    it("should return a tuple of an Arbeitsausgabe's description and monthly amount", () => {
      const arbeitsausgabeDescription = faker.word.words();
      const [description, monthlyAmount] = mapArbeitsausgabe({
        beschreibung: arbeitsausgabeDescription,
        zahlungsfrequenz: "monthly",
        betrag: "20",
      });
      expect(description).toBe(arbeitsausgabeDescription);
      expect(monthlyAmount).toBe(20);
    });

    it("should return the correct amount for a yearly amount", () => {
      const [, monthlyAmount] = mapArbeitsausgabe({
        beschreibung: faker.word.words(),
        zahlungsfrequenz: "yearly",
        betrag: "120",
      });
      expect(monthlyAmount).toBe(10);
    });

    it("should return the correct amount for a one-time amount", () => {
      const [, monthlyAmount] = mapArbeitsausgabe({
        beschreibung: faker.word.words(),
        zahlungsfrequenz: "one-time",
        betrag: "1200",
      });
      expect(monthlyAmount).toBe(100);
    });

    it("should return the correct amount for a quarterly amount", () => {
      const [, monthlyAmount] = mapArbeitsausgabe({
        beschreibung: faker.word.words(),
        zahlungsfrequenz: "quarterly",
        betrag: "60",
      });
      expect(monthlyAmount).toBe(20);
    });
  });

  describe("getTotalMonthlyArbeitsausgaben", () => {
    it("should return the total monthly arbeitsausgaben sum, given a list of arbeitsausgaben", () => {
      const arbeitsausgaben: Arbeitsausgabe[] = [
        {
          beschreibung: faker.word.words(),
          betrag: "100",
          zahlungsfrequenz: "monthly",
        },
        {
          beschreibung: faker.word.words(),
          betrag: "120",
          zahlungsfrequenz: "yearly",
        },
        {
          beschreibung: faker.word.words(),
          betrag: "60",
          zahlungsfrequenz: "quarterly",
        },
        {
          beschreibung: faker.word.words(),
          betrag: "120",
          zahlungsfrequenz: "one-time",
        },
      ];
      expect(getTotalMonthlyArbeitsausgaben(arbeitsausgaben)).toBe(140);
    });
  });
});

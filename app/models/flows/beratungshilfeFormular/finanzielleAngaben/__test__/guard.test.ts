import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";
import { finanzielleAngabeGuards } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/guards";

describe("finanzielleAngabeGuards", () => {
  describe("hasPartnerschaftOrSeparated", () => {
    it("should return truthy for married context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "yes",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftOrSeparated({
        context,
      });

      expect(actual).toBeTruthy();
    });

    it("should return truthy for separated context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "separated",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftOrSeparated({
        context,
      });

      expect(actual).toBeTruthy();
    });
  });

  describe("hasPartnerschaftNoOrWidowed", () => {
    it("should return truthy for single context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "no",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftNoOrWidowed({
        context,
      });

      expect(actual).toBeTruthy();
    });

    it("should return truthy for widowed context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "widowed",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftNoOrWidowed({
        context,
      });

      expect(actual).toBeTruthy();
    });
  });

  describe("isValidKinderArrayIndex", () => {
    // TODO: remove extensive tests in favor of checking whether isValidArrayIndex was called
    const contextMockData: BeratungshilfeFinanzielleAngaben = {
      kinder: [
        {
          vorname: "Clara",
          nachname: "Müller",
          geburtsdatum: "01.01.2010",
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: "100",
          unterhalt: "yes",
          unterhaltsSumme: "100",
        },
      ],
    };
    it("should return true if valid index is passed", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        ...contextMockData,
        pageData: { arrayIndexes: [1] },
      };

      const actual = finanzielleAngabeGuards.isValidKinderArrayIndex({
        context,
      });

      expect(actual).toBe(true);
    });
    it("should return false if invalid index is passed", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        ...contextMockData,
        pageData: { arrayIndexes: [2] },
      };

      const actual = finanzielleAngabeGuards.isValidKinderArrayIndex({
        context,
      });

      expect(actual).toBe(false);
    });
    it("should return false if invalid negative index is passed", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        ...contextMockData,
        pageData: { arrayIndexes: [-1] },
      };

      const actual = finanzielleAngabeGuards.isValidKinderArrayIndex({
        context,
      });

      expect(actual).toBe(false);
    });
    it("should return true if the array is undefined and valid index is passed", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        kinder: undefined,
        pageData: { arrayIndexes: [0] },
      };

      const actual = finanzielleAngabeGuards.isValidKinderArrayIndex({
        context,
      });

      expect(actual).toBe(true);
    });
    it("should return false if the array is undefined and invalid index is passed", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        kinder: undefined,
        pageData: { arrayIndexes: [1] },
      };

      const actual = finanzielleAngabeGuards.isValidKinderArrayIndex({
        context,
      });

      expect(actual).toBe(false);
    });
    it("should return false if pageData is undefined", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        ...contextMockData,
        pageData: undefined,
      };

      const actual = finanzielleAngabeGuards.isValidKinderArrayIndex({
        context,
      });

      expect(actual).toBe(false);
    });
  });
});

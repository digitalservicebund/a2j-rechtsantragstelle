import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import {
  eigentumZusammenfassungShowWarnings,
  getArrayIndexStrings,
  getKinderStrings,
} from "~/flows/shared/stringReplacements";

describe("stringReplacements", () => {
  describe("getKinderStrings", () => {
    it("returns vorname and nachname for given context", () => {
      const context = {
        ...happyPathData,
        pageData: {
          arrayIndexes: [0],
        },
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({
        "kind#vorname": context.kinder?.[0].vorname,
        "kind#nachname": context.kinder?.[0].nachname,
      });
    });

    it("returns an empty object when arrayIndex is too high", () => {
      const context = {
        ...happyPathData,
        pageData: {
          arrayIndexes: [5],
        },
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({});
    });

    it("returns an empty object for given context when arrayIndexes missing", () => {
      const kinderStrings = getKinderStrings(happyPathData);

      expect(kinderStrings).toEqual({});
    });

    it("returns an empty object for given context when kinder is undefined", () => {
      const context = {
        ...happyPathData,
        kinder: undefined,
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({});
    });
  });
  describe("getArrayIndexStrings", () => {
    it("returns an array index for given context", () => {
      const context = {
        ...happyPathData,
        pageData: {
          arrayIndexes: [3],
        },
      };

      const arrayIndexStrings = getArrayIndexStrings(context);

      expect(arrayIndexStrings).toEqual({ "array#index": "4" });
    });

    it("returns an empty object for given context when arrayIndexes are not passed", () => {
      const arrayIndexStrings = getArrayIndexStrings(happyPathData);

      expect(arrayIndexStrings).toEqual({});
    });
  });

  describe("eigentumZusammenfassungShowWarnings", () => {
    it("return string config to show all warnings", () => {
      expect(
        eigentumZusammenfassungShowWarnings({
          eigentumTotalWorth: "less10000",
          partnerschaft: "yes",
        }),
      ).toStrictEqual({
        hasPartnerschaftYes: true,
        eigentumTotalWorthLessThan10000: true,
      });
    });

    it("return string config to show no warnings", () => {
      expect(
        eigentumZusammenfassungShowWarnings({
          eigentumTotalWorth: "more10000",
          partnerschaft: "no",
        }),
      ).toStrictEqual({
        hasPartnerschaftYes: false,
        eigentumTotalWorthLessThan10000: false,
      });
    });
  });
});

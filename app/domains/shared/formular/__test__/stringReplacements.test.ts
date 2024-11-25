import { happyPathData } from "~/domains/beratungshilfe/services/pdf/__test__/beratungshilfeFormularData";
import {
  eigentumZusammenfassungShowPartnerschaftWarnings,
  getArrayIndexStrings,
  getKinderStrings,
} from "~/domains/shared/formular/stringReplacements";

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

  describe("eigentumZusammenfassungShowPartnerschaftWarnings", () => {
    it("return string config to show warning", () => {
      expect(
        eigentumZusammenfassungShowPartnerschaftWarnings({
          partnerschaft: "yes",
        }),
      ).toStrictEqual({
        hasPartnerschaftYes: true,
      });
    });

    it("return string config to show no warning", () => {
      expect(
        eigentumZusammenfassungShowPartnerschaftWarnings({
          partnerschaft: "no",
        }),
      ).toStrictEqual({
        hasPartnerschaftYes: false,
      });
    });
  });
});

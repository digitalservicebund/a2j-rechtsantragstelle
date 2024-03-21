import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import { getKinderStrings } from "~/models/flows/beratungshilfeFormular/stringReplacements";

describe("stringReplacements", () => {
  describe("getKinderStrings", () => {
    it("returns a flattened array item for given context", () => {
      const context = {
        ...happyPathData,
        pageData: {
          arrayIndexes: [0],
        },
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({
        "kind#index": "1",
        "kind#vorname": context.kinder?.[0].vorname,
        "kind#nachname": context.kinder?.[0].nachname,
      });
    });

    it("returns a empty object for given context when arrayIndexes missing", () => {
      const context = happyPathData;

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({});
    });

    it("returns a empty object for given context when kinder is undefined", () => {
      const context = {
        ...happyPathData,
        kinder: undefined,
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({});
    });

    it("returns only the kind index when context kinder and a greater arrayIndexes is given", () => {
      const context = {
        ...happyPathData,
        pageData: {
          arrayIndexes: [4],
        },
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({ "kind#index": "3" });
    });

    it("returns only the kind index when context kinder is an empty array", () => {
      const context = {
        ...happyPathData,
        kinder: [],
        pageData: {
          arrayIndexes: [0],
        },
      };

      const kinderStrings = getKinderStrings(context);

      expect(kinderStrings).toEqual({ "kind#index": "1" });
    });
  });
});

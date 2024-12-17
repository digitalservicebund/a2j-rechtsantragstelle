import { z } from "zod";
import {
  compileAllStrapiPages,
  getAllPossibleStates,
  ignoreList,
  invertStrapiFormFields,
  zodKeys,
} from "tests/integration/util";

describe("integration testing helper functions", () => {
  describe("compileAllStrapiPages", () => {
    it("should return a flat array of all strapi page names", () => {
      const result = compileAllStrapiPages("/beratungshilfe/antrag", {
        "/beratungshilfe/antrag": {
          "vorab-check-pages": [
            // @ts-expect-error missing attributes
            {
              stepId: "step-1",
              locale: "de",
            },
          ],
          "form-flow-pages": [
            // @ts-expect-error missing attributes
            {
              stepId: "step-2",
              locale: "de",
            },
          ],
          "result-pages": [
            // @ts-expect-error missing attributes
            {
              stepId: "step-3",
              locale: "de",
            },
          ],
        },
      });

      expect(result.length).toBe(3);
      expect(result).toEqual(
        expect.arrayContaining(["step-1", "step-2", "step-3"]),
      );
    });

    it("should filter out pages with locale other than the default locale", () => {
      const result = compileAllStrapiPages("/beratungshilfe/antrag", {
        "/beratungshilfe/antrag": {
          "vorab-check-pages": [
            // @ts-expect-error missing attributes
            {
              stepId: "step-1",
              locale: "en",
            },
            // @ts-expect-error missing attributes
            {
              stepId: "step-1",
              locale: "en",
            },
          ],
          "form-flow-pages": [],
          "result-pages": [],
        },
      });
      expect(result.length).toBe(0);
    });
  });

  describe("zodKeys", () => {
    it("should recursively return all keys of a nested zod schema", () => {
      const schemaKeys = zodKeys(
        z.object({
          a: z.string(),
          b: z.number(),
          c: z.object({ d: z.string() }),
          e: z.array(z.object({ f: z.string() })),
        }),
      );

      expect(schemaKeys).toEqual(["a", "b", "c.d", "e#f"]);
    });

    it("should return an empty array when schema is null or undefined", () => {
      // @ts-expect-error
      expect(zodKeys(null)).toEqual([]);
      // @ts-expect-error
      expect(zodKeys(undefined)).toEqual([]);
    });

    it("should return the keys of a nested object inside of an array", () => {
      const schemaKeys = zodKeys(
        z.object({
          a: z.array(
            z.object({ b: z.string(), c: z.object({ d: z.string() }) }),
          ),
        }),
      );
      expect(schemaKeys).toEqual(["a#b", "a#c.d"]);
    });
  });

  describe("allPossibleStates", () => {
    it("should return an array of all possible states", () => {
      const allPossibleStates = getAllPossibleStates({
        config: {
          states: {
            state1: {},
            state2: {
              states: {
                state3: {},
              },
            },
          },
        },
        flowType: "formFlow",
        guards: {},
      });
      expect(allPossibleStates).toEqual([
        "/state1",
        "/state2",
        "/state2/state3",
      ]);
    });

    it.each(ignoreList)("should skip state %s", (ignoredPath: string) => {
      const allPossibleStates = getAllPossibleStates({
        config: {
          states: {
            [ignoredPath]: {},
          },
        },
        flowType: "formFlow",
        guards: {},
      });
      expect(allPossibleStates).toEqual([]);
    });

    it("should skip redundant states with an initial state", () => {
      const allPossibleStates = getAllPossibleStates({
        config: {
          states: {
            state1: {},
            state2: {
              initial: "state3",
              states: {
                state3: {},
              },
            },
          },
        },
        flowType: "formFlow",
        guards: {},
      });
      expect(allPossibleStates).toEqual(["/state1", "/state2/state3"]);
    });
  });

  describe("invertStrapiFormFields", () => {
    it("should reverse a FormFieldsMap to list the field names first, then the paths", () => {
      const result = invertStrapiFormFields({
        field: ["path1", "path2"],
        field2: ["path3", "path4"],
      });
      expect(result).toEqual([
        ["path1", "field"],
        ["path2", "field"],
        ["path3", "field2"],
        ["path4", "field2"],
      ]);
    });
  });
});

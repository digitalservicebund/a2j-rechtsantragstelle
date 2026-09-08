import { buildFlowController } from "../../server/buildFlowController";
import type { Config } from "../../server/types";
import { validFormPaths } from "../validFormPaths";

// Self-contained xState config so these tests do not depend on any real flow's
// engine. A short linear "start" section leads into a "vermoegen" section that
// holds a "konten" array (gated by the hasKonto statement key).
const config = {
  id: "/prozesskostenhilfe/formular",
  initial: "start",
  meta: {
    arrays: {
      konten: {
        event: "add-konten",
        url: "/prozesskostenhilfe/formular/vermoegen/konten",
        initialInputUrl: "daten",
        statementKey: "hasKonto",
        isArrayRelevant: (context: { erwerbstaetig?: string }) =>
          context.erwerbstaetig === "no",
      },
    },
  },
  states: {
    start: {
      id: "start",
      initial: "erste-frage",
      states: {
        "erste-frage": {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.ersteFrage === "no",
                target: "zweite-frage",
              },
              { target: "erste-hinweis" },
            ],
          },
        },
        "zweite-frage": {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.zweiteFrage === "no",
                target: "#vermoegen",
              },
              { target: "zweite-hinweis" },
            ],
          },
        },
        "erste-hinweis": {},
        "zweite-hinweis": {},
      },
    },
    vermoegen: {
      id: "vermoegen",
      initial: "overview",
      states: {
        overview: {
          on: { SUBMIT: "done", "add-konten": "konten" },
        },
        konten: {
          initial: "daten",
          states: {
            daten: { on: { SUBMIT: "ende", BACK: "#vermoegen.overview" } },
            ende: {},
          },
        },
        done: {},
      },
    },
  },
} satisfies Config;

describe("validFormPaths", () => {
  it("returns base path with reachable steps", () => {
    expect(
      validFormPaths(buildFlowController({ config, data: { ersteFrage: "no" } })),
    ).toStrictEqual([
      {
        stepIds: [
          "/start/erste-frage",
          "/start/zweite-frage",
          "/start/zweite-hinweis",
        ],
      },
    ]);
  });

  describe("works for arrays", () => {
    const baseData = {
      ersteFrage: "no",
      zweiteFrage: "no",
    };

    it("includes paths for multiple array entries", () => {
      const data = {
        ...baseData,
        hasKonto: "yes",
        konten: [{ betrag: "1" }, { betrag: "2" }],
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths.length).toEqual(3);

      expect(validPaths[1]).toStrictEqual({
        stepIds: ["/vermoegen/konten/daten", "/vermoegen/konten/ende"],
        arrayIndex: 0,
      });
      expect(validPaths[2]).toStrictEqual({
        stepIds: ["/vermoegen/konten/daten", "/vermoegen/konten/ende"],
        arrayIndex: 1,
      });
    });

    it("excludes arrays if statement key not 'yes'", () => {
      const data = {
        ...baseData,
        hasKonto: "no",
        konten: [{ betrag: "1" }],
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("excludes array with empty array but statement key 'yes'", () => {
      const data = { ...baseData, hasKonto: "yes", konten: [] };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("excludes array with undefined array but statement key 'yes'", () => {
      const data = { ...baseData, hasKonto: "yes", konten: undefined };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("excludes array if it can't be reached", () => {
      const data = {
        ersteFrage: "yes",
        hasKonto: "yes",
        konten: [{ betrag: "1" }],
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toHaveLength(1);
    });

    it("includes arrays when isArrayRelevant returns true even if statement key is not 'yes'", () => {
      const data = {
        ...baseData,
        hasKonto: "no",
        erwerbstaetig: "no",
        konten: [{ betrag: "1" }],
      };
      const validPaths = validFormPaths(buildFlowController({ config, data }));
      expect(validPaths).toContainEqual({
        stepIds: ["/vermoegen/konten/daten", "/vermoegen/konten/ende"],
        arrayIndex: 0,
      });
    });
  });
});

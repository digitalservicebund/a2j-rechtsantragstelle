import {
  insertIndexesIntoPath,
  stateValueToStepIds,
  stepIdToPath,
} from "~/services/flow/stepIdConverter";

describe("getStateValueString", () => {
  it("returns simple value if single state given", () => {
    expect(stateValueToStepIds("state")).toStrictEqual(["state"]);
  });

  it("returns simple value if nested state given", () => {
    expect(stateValueToStepIds({ parent: "state" })).toStrictEqual([
      "parent/state",
    ]);
  });

  it("returns simple value if multiple nested state given", () => {
    expect(
      stateValueToStepIds({ parent1: { parent2: "state" } }),
    ).toStrictEqual(["parent1/parent2/state"]);
  });

  it("returns multiple values if multiple nested state given", () => {
    expect(
      stateValueToStepIds({ parent1: "state1", parent2: "state2" }),
    ).toStrictEqual(["parent1/state1", "parent2/state2"]);
  });

  it("returns multiple values if multiple nested state given with empty objects", () => {
    expect(
      stateValueToStepIds({
        parent1: { parent2: { child1: "state2", child2: {} } },
      }),
    ).toStrictEqual([
      "parent1/parent2/child1/state2",
      "parent1/parent2/child2",
    ]);
  });
});

describe("stepIdToPath", () => {
  it.each([
    ["", [""]],
    ["a/b", ["a", "b"]],
    ["a/b/c", ["a", "b", "c"]],
    ["ergebnis/b/c", ["ergebnis/b", "c"]],
  ])("when the input is '%s'", (text, expected) => {
    expect(stepIdToPath(text)).toEqual(expected);
  });
});

describe("insertIndexesIntoPath", () => {
  // TODO fix for these cases:
  /*
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/6/name",
      "/completely/different/with/the/exact/same/length",
      [4, 6],
      "/completely/different/with/the/exact/same/length",
    ],
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/spielzeug/6/name",
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/spielzeug/uebersicht",
      [4, 6],
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/uebersicht",
    ],
   */
  it.each([
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/1/name",
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/wohnort",
      [1],
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/1/wohnort",
    ],
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/name",
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/uebersicht",
      [4],
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/uebersicht",
    ],
    [
      "/beratungshilfe/antrag/finanzielleAngaben/eigentum/konto/4/daten",
      "/beratungshilfe/antrag/finanzielleAngaben/eigentum-zusammenfassung",
      [4],
      "/beratungshilfe/antrag/finanzielleAngaben/eigentum-zusammenfassung",
    ],
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/3/spielzeug/1/name",
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/spielzeug/farbe",
      [3, 1],
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/3/spielzeug/1/farbe",
    ],
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/puppen/6/name",
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/spielzeug/puppen/farbe",
      [4, 6],
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/puppen/6/farbe",
    ],
    [
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/6/name",
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/spielzeug/farbe/blau",
      [4, 6],
      "/beratungshilfe/antrag/finanzielleAngaben/kinder/kinder/4/spielzeug/6/farbe/blau",
    ],
  ])(
    "when the valid input is '%s'",
    (currentPath, destinationPath, arrayIndexes, expected) => {
      expect(
        insertIndexesIntoPath(currentPath, destinationPath, arrayIndexes),
      ).toEqual(expected);
    },
  );
});

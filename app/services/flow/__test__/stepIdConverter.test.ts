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
  it.each([
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/1/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/wohnort",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/1/wohnort",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum/konto/4/daten",
      "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung",

      "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/3/spielzeug/1/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/spielzeug/farbe",

      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/3/spielzeug/1/farbe",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/puppen/6/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/spielzeug/puppen/farbe",

      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/puppen/6/farbe",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/6/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/spielzeug/farbe/blau",

      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/6/farbe/blau",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/6/name",
      "/completely/different/with/the/exact/same/length",
      "/completely/different/with/the/exact/same/length",
    ],
    [
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/spielzeug/6/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/spielzeug/uebersicht",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/spielzeug/uebersicht",
    ],
  ])(
    "when the valid input is '%s'",
    (currentPath, destinationPath, expected) => {
      expect(insertIndexesIntoPath(currentPath, destinationPath)).toEqual(
        expected,
      );
    },
  );
});

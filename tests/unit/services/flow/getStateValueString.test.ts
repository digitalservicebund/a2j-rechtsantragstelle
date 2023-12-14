import { getStateValueString } from "~/services/flow/getStateValueString";

describe("getStateValueString", () => {
  it("returns simple value if single state given", () => {
    expect(getStateValueString("state")).toStrictEqual("state");
  });

  it("returns simple value if nested state given", () => {
    expect(getStateValueString({ parent: "state" })).toStrictEqual(
      "parent.state",
    );
  });

  it("returns simple value if multiple nested state given", () => {
    expect(
      getStateValueString({ parent1: { parent2: "state" } }),
    ).toStrictEqual("parent1.parent2.state");
  });

  it("throws error if multiple states given", () => {
    expect(() =>
      getStateValueString({ parent1: "state1", parent2: "state2" }),
    ).toThrow();
  });
});

import { stateValueToStateId } from "~/services/flow/getStateValueString";

describe("getStateValueString", () => {
  it("returns simple value if single state given", () => {
    expect(stateValueToStateId("state")).toStrictEqual("state");
  });

  it("returns simple value if nested state given", () => {
    expect(stateValueToStateId({ parent: "state" })).toStrictEqual(
      "parent.state",
    );
  });

  it("returns simple value if multiple nested state given", () => {
    expect(
      stateValueToStateId({ parent1: { parent2: "state" } }),
    ).toStrictEqual("parent1.parent2.state");
  });

  it("throws error if multiple states given", () => {
    expect(() =>
      stateValueToStateId({ parent1: "state1", parent2: "state2" }),
    ).toThrow();
  });
});

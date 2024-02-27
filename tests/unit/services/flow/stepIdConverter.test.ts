import { stateValueToStepId } from "~/services/flow/stepIdConverter";

describe("getStateValueString", () => {
  it("returns simple value if single state given", () => {
    expect(stateValueToStepId("state")).toStrictEqual("state");
  });

  it("returns simple value if nested state given", () => {
    expect(stateValueToStepId({ parent: "state" })).toStrictEqual(
      "parent/state",
    );
  });

  it("returns simple value if multiple nested state given", () => {
    expect(stateValueToStepId({ parent1: { parent2: "state" } })).toStrictEqual(
      "parent1/parent2/state",
    );
  });

  it("throws error if multiple states given", () => {
    expect(() =>
      stateValueToStepId({ parent1: "state1", parent2: "state2" }),
    ).toThrow();
  });
});

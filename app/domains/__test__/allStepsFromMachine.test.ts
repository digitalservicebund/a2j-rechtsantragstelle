import { createMachine } from "xstate";
import { type FlowStateMachine } from "~/services/flow/server/types";
import { allStepsFromMachine } from "~/domains/__test__/allStepsFromMachine";

describe("allStepsFromMachine", () => {
  it("should return all steps from an xState machine", () => {
    const machine: FlowStateMachine = createMachine({
      initial: "step1",
      states: {
        step1: { on: { SUBMIT: "step2" } },
        step2: { on: { SUBMIT: "step3" } },
        step3: {},
      },
    });

    expect(allStepsFromMachine(machine)).toEqual([
      "/step1",
      "/step2",
      "/step3",
    ]);
  });

  it("should handle nested steps", () => {
    const machine: FlowStateMachine = createMachine({
      initial: "step1",
      states: {
        step1: {
          initial: "step1b",
          states: { step1b: { on: { SUBMIT: "#step2" } } },
        },
        step2: { id: "step2", on: { SUBMIT: "step3" } },
        step3: {},
      },
    });
    expect(allStepsFromMachine(machine)).toEqual([
      "/step1/step1b",
      "/step2",
      "/step3",
    ]);
  });
});

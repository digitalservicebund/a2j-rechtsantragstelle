import { createMachine } from "xstate";
import {
  type Config,
  buildFlowController,
  nextStepId,
} from "~/services/flow/server/buildFlowController";

const config: Config = {
  id: "/test/flow",
  initial: "step1",
  states: {
    step1: {
      on: {
        SUBMIT: [
          {
            target: "step1Exit",
            guard: ({ context }) => context.step1 === false,
          },
          { target: "step2", guard: ({ context }) => context.step1 === true },
        ],
      },
    },
    step1Exit: { on: { BACK: { target: "step1" } } },
    step2: {
      on: { SUBMIT: [{ target: "step3" }], BACK: { target: "step1" } },
    },
    step3: {
      on: { SUBMIT: [{ target: "step4" }], BACK: { target: "step2" } },
    },
    step4: {
      initial: "step1",
      states: {
        step1: {
          on: {
            SUBMIT: [{ target: "step2" }],
            BACK: { target: "#/test/flow.step3" },
          },
        },
        step2: {
          on: { BACK: { target: "step1" } },
        },
      },
    },
    step5: {
      on: { BACK: { target: "step4" } },
    },
  },
};

const nestedInitialStateConfig: Config = {
  id: "/test/nested",
  initial: "parent1",
  states: {
    parent1: {
      initial: "step1",
      states: {
        step1: {
          on: {
            SUBMIT: { target: "step2" },
          },
        },
        step2: {},
      },
    },
  },
};

describe("buildFlowController", () => {
  describe("isFinal", () => {
    it("returns true if final step", () => {
      expect(buildFlowController({ config }).isFinal("step1Exit")).toBe(true);
    });

    it("returns false if not final step", () => {
      expect(buildFlowController({ config }).isFinal("step1")).toBe(false);
    });

    it("returns false if nested step is not final step", () => {
      expect(buildFlowController({ config }).isFinal("step4/step1")).toBe(
        false,
      );
    });

    it("returns true if nested step is final step", () => {
      expect(buildFlowController({ config }).isFinal("step4/step2")).toBe(true);
    });
  });

  describe("isReachable", () => {
    it("returns true if step is reachable with given data", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).isReachable("step3"),
      ).toBe(true);
    });

    it("returns false if step is not reachable", () => {
      expect(buildFlowController({ config }).isReachable("step3")).toBe(false);
    });

    it("returns false if nested step is not reachable", () => {
      expect(buildFlowController({ config }).isReachable("step4/step1")).toBe(
        false,
      );
    });

    it("returns true if nested step is reachable with given data", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).isReachable("step4/step2"),
      ).toBe(true);
    });
  });

  describe("getPrevious", () => {
    it("returns previous step (step2) if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step3"),
      ).toEqual("/test/flow/step2");
    });

    it("returns previous nested step if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step4/step2"),
      ).toEqual("/test/flow/step4/step1");
    });

    it("returns previous step from nested step if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step4/step1"),
      ).toEqual("/test/flow/step3");
    });

    it("returns previous nested step from step if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step5"),
      ).toEqual("/test/flow/step4/step1");
    });

    it("returns undefined if already first step", () => {
      expect(
        buildFlowController({ config }).getPrevious("step1"),
      ).toBeUndefined();
    });

    it("returns undefined if already first nested step", () => {
      expect(
        buildFlowController({ config: nestedInitialStateConfig }).getPrevious(
          "parent1/step1",
        ),
      ).toBeUndefined();
    });
  });

  describe("getNext", () => {
    it("returns step2", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step1"),
      ).toEqual("/test/flow/step2");
    });

    it("returns the next nested step from a step with valid data", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step3"),
      ).toEqual("/test/flow/step4/step1");
    });

    it("returns the next nested step from a nested step with valid data", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step4.step1"),
      ).toEqual("/test/flow/step4/step2");
    });

    it("returns undefined if already last step", () => {
      expect(
        buildFlowController({
          config,
          data: {},
        }).getNext("step5"),
      ).toBeUndefined();
    });

    it("returns undefined if already last nested step", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step4/step2"),
      ).toBeUndefined();
    });
  });

  describe("getInitial", () => {
    it("returns correct simple step", () => {
      expect(buildFlowController({ config }).getInitial()).toEqual(
        "/test/flow/step1",
      );
    });

    it("returns correct step if nested initial step", () => {
      expect(
        buildFlowController({ config: nestedInitialStateConfig }).getInitial(),
      ).toEqual("/test/nested/parent1/step1");
    });
  });

  describe("getProgress", () => {
    it("returns 5/5", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getProgress("step4.step2"),
      ).toStrictEqual({
        progress: 5,
        max: 5,
      });
    });

    it("returns 3/5", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getProgress("step3"),
      ).toStrictEqual({
        progress: 3,
        max: 5,
      });
    });

    // TODO: We ignore nested steps for now, we have to fix the getProgress function to include nested steps.
    it("returns 1/5", () => {
      expect(
        buildFlowController({ config }).getProgress("step1"),
      ).toStrictEqual({
        progress: 1,
        max: 5,
      });
    });

    it("returns 2/5 even if data doesn't fit", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: false },
        }).getProgress("step2"),
      ).toStrictEqual({
        progress: 2,
        max: 5,
      });
    });
  });

  describe(".stepStates()", () => {
    it("ignores states without substates or done function", () => {
      expect(
        buildFlowController({
          config: {
            id: "/test",
            initial: "start",
            states: { start: {} },
          },
        }).stepStates(),
      ).toEqual([]);
    });

    it("builds single step state", () => {
      expect(
        buildFlowController({
          config: {
            id: "/test",
            initial: "start",
            states: {
              start: { meta: { done: () => true } },
            },
          },
        }).stepStates(),
      ).toEqual([
        {
          isDone: true,
          isReachable: true,
          stepId: "start",
          url: "/test/start",
        },
      ]);
    });

    it("builds nested step states", () => {
      expect(
        buildFlowController({
          config: {
            id: "/test",
            initial: "parent1",
            states: {
              parent1: {
                initial: "child1",
                states: {
                  child1: {
                    initial: "start",
                    states: {
                      start: { on: { SUBMIT: "#/test.parent1.child2" } },
                    },
                  },
                  child2: { initial: "start", states: { start: {} } },
                },
              },
            },
          },
        }).stepStates(),
      ).toEqual([
        {
          isDone: false,
          isReachable: true,
          stepId: "parent1",
          url: "/test/parent1",
          subStates: [
            {
              isDone: false,
              isReachable: true,
              stepId: "parent1/child1",
              url: "/test/parent1/child1/start",
            },
            {
              isDone: false,
              isReachable: true,
              stepId: "parent1/child2",
              url: "/test/parent1/child2/start",
            },
          ],
        },
      ]);
    });

    it("deals with eventless initial state", () => {
      expect(
        buildFlowController({
          config: {
            id: "/test",
            initial: "parent1",
            states: {
              parent1: {
                initial: "child1",
                states: {
                  child1: { always: { target: "child2" } },
                  child2: { initial: "start", states: { start: {} } },
                },
              },
            },
          },
        }).stepStates(),
      ).toEqual([
        {
          isDone: false,
          isReachable: true,
          stepId: "parent1",
          url: "/test/parent1",
          subStates: [
            {
              isDone: false,
              isReachable: true,
              stepId: "parent1/child2",
              url: "/test/parent1/child2/start",
            },
          ],
        },
      ]);
    });

    it("handles unreachable nested steps", () => {
      expect(
        buildFlowController({
          config: {
            id: "/test",
            initial: "child1",
            states: {
              child1: { meta: { done: () => true }, on: { SUBMIT: "child3" } },
              child2: { meta: { done: () => true } },
              child3: { initial: "start", states: { start: {} } },
              child4: { initial: "start", states: { start: {} } },
            },
          },
        }).stepStates(),
      ).toEqual([
        {
          isDone: true,
          isReachable: true,
          stepId: "child1",
          url: "/test/child1",
        },
        {
          isDone: true,
          isReachable: false,
          stepId: "child2",
          url: "/test/child2",
        },
        {
          isDone: false,
          isReachable: true,
          stepId: "child3",
          url: "/test/child3/start",
        },
        {
          isDone: false,
          isReachable: false,
          stepId: "child4",
          url: "/test/child4/start",
        },
      ]);
    });
  });

  it("all children must be done for parent to be done", () => {
    const stepStates = buildFlowController({
      config: {
        id: "/test",
        initial: "parent1",
        states: {
          parent1: {
            initial: "child1",
            states: {
              child1: {
                initial: "start",
                meta: { done: () => true },
                states: {
                  start: { on: { SUBMIT: "#/test.parent1.child2" } },
                },
              },
              child2: {
                initial: "start",
                meta: { done: () => false },
                states: {
                  start: { on: { SUBMIT: "#/test.parent2" } },
                },
              },
            },
          },
          parent2: {
            initial: "child1",
            states: {
              child1: {
                initial: "start",
                meta: { done: () => true },
                states: {
                  start: { on: { SUBMIT: "#/test.parent2.child2" } },
                },
              },
              child2: {
                initial: "start",
                meta: { done: () => true },
                states: { start: {} },
              },
            },
          },
        },
      },
    }).stepStates();
    expect(stepStates[0].isDone).toBe(false);
    expect(stepStates[1].isDone).toBe(true);
  });

  it("any child must be reachable for parent to be reachable", () => {
    const stepStates = buildFlowController({
      config: {
        id: "/test",
        initial: "parent1",
        states: {
          parent1: {
            initial: "child1",
            states: { child1: { on: { SUBMIT: "#/test.parent2" } } },
          },
          parent2: {
            initial: "child1",
            states: { child1: {} },
          },
          parent3: {
            initial: "child1",
            states: { child1: {} },
          },
        },
      },
    }).stepStates();
    expect(stepStates[1].isReachable).toBe(true);
    expect(stepStates[2].isReachable).toBe(false);
  });
});

describe("nextStepId", () => {
  const machine = createMachine(config);
  it("should provide correct SUBMIT destination", () => {
    const destination = nextStepId(machine, "step1", "SUBMIT", {
      step1: false,
    });
    expect(destination).toEqual("step1Exit");
  });

  it("should provide correct BACK destination", () => {
    const destination = nextStepId(machine, "step1Exit", "BACK", {
      step1: false,
    });
    expect(destination).toEqual("step1");
  });
});

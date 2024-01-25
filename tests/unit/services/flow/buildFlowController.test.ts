import {
  type Config,
  buildFlowController,
} from "~/services/flow/server/buildFlowController";

const config: Config = {
  id: "/test/flow/",
  initial: "step1",
  predictableActionArguments: true,
  states: {
    step1: {
      meta: { progressPosition: 1 },
      on: {
        SUBMIT: [
          { target: "step1Exit", cond: (context) => context.step1 === false },
          { target: "step2", cond: (context) => context.step1 === true },
        ],
      },
    },
    step1Exit: { on: { BACK: { target: "step1" } } },
    step2: {
      meta: { progressPosition: 2 },
      on: { SUBMIT: [{ target: "step3" }], BACK: { target: "step1" } },
    },
    step3: {
      meta: { progressPosition: 3 },
      on: { SUBMIT: [{ target: "step4" }], BACK: { target: "step2" } },
    },
    step4: {
      meta: { progressPosition: 4 },
      initial: "step1",
      states: {
        step1: {
          on: {
            SUBMIT: [{ target: "step2" }],
            BACK: { target: "#/test/flow/.step3" },
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
  id: "/test/nested/",
  initial: "parent1",
  predictableActionArguments: true,
  states: {
    parent1: {
      id: "/test/nested/",
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
  describe("isInitial", () => {
    it("returns true if initial step", () => {
      expect(buildFlowController({ config }).isInitial("step1")).toBe(true);
    });

    it("returns true if nested initial step", () => {
      expect(
        buildFlowController({ config: nestedInitialStateConfig }).isInitial(
          "parent1.step1",
        ),
      ).toBe(true);
    });

    it("returns false if not intial step", () => {
      expect(buildFlowController({ config }).isInitial("step2")).toBe(false);
    });

    it("returns false if nested step is not initial step", () => {
      expect(buildFlowController({ config }).isInitial("step4/step1")).toBe(
        false,
      );
    });
  });

  describe("isFinal", () => {
    it("returns true if final step", () => {
      expect(buildFlowController({ config }).isFinal("step1Exit")).toBe(true);
    });

    it("returns true if final step but SUBMIT given as empty array", () => {
      expect(
        buildFlowController({
          config: {
            predictableActionArguments: true,
            id: "/flow/final/",
            initial: "step1",
            states: {
              step1: { on: { SUBMIT: [] } },
            },
          },
        }).isFinal("step1"),
      ).toBe(true);
    });

    it("returns true if final step but SUBMIT given as empty object", () => {
      expect(
        buildFlowController({
          config: {
            predictableActionArguments: true,
            id: "/flow/final/",
            initial: "step1",
            states: {
              step1: { on: { SUBMIT: {} } },
            },
          },
        }).isFinal("step1"),
      ).toBe(true);
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
      ).toStrictEqual({
        name: "step2",
        url: "/test/flow/step2",
      });
    });

    it("returns previous nested step if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step4/step2"),
      ).toStrictEqual({
        name: "step4.step1",
        url: "/test/flow/step4/step1",
      });
    });

    it("returns previous step from nested step if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step4/step1"),
      ).toStrictEqual({
        name: "step3",
        url: "/test/flow/step3",
      });
    });

    it("returns previous nested step from step if data is correct", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getPrevious("step5"),
      ).toStrictEqual({
        name: "step4.step1",
        url: "/test/flow/step4/step1",
      });
    });

    it("returns undefined if already first step", () => {
      expect(
        buildFlowController({ config }).getPrevious("step1"),
      ).toBeUndefined();
    });

    it("returns undefined if already first nested step", () => {
      expect(
        buildFlowController({ config: nestedInitialStateConfig }).getPrevious(
          "parent1.step1",
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
      ).toStrictEqual({
        name: "step2",
        url: "/test/flow/step2",
      });
    });

    it("returns the next nested step from a step with valid data", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step3"),
      ).toStrictEqual({
        name: "step4.step1",
        url: "/test/flow/step4/step1",
      });
    });

    it("returns the next nested step from a nested step with valid data", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step4.step1"),
      ).toStrictEqual({
        name: "step4.step2",
        url: "/test/flow/step4/step2",
      });
    });

    it("throws error if already last step", () => {
      expect(() =>
        buildFlowController({
          config,
          data: {},
        }).getNext("step5"),
      ).toThrow();
    });

    it("throws error if already last nested step", () => {
      expect(() =>
        buildFlowController({
          config,
          data: { step1: true },
        }).getNext("step4/step2"),
      ).toThrow();
    });
  });

  describe("getInitial", () => {
    it("returns correct simple step", () => {
      expect(buildFlowController({ config }).getInitial()).toStrictEqual({
        name: "step1",
        url: "/test/flow/step1",
      });
    });

    it("returns correct step if nested initial step", () => {
      expect(
        buildFlowController({ config: nestedInitialStateConfig }).getInitial(),
      ).toStrictEqual({
        name: "parent1.step1",
        url: "/test/nested/parent1/step1",
      });
    });
  });

  describe("getLastReachable", () => {
    it("returns step4.step2", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getLastReachable(),
      ).toStrictEqual({
        name: "step4.step2",
        url: "/test/flow/step4/step2",
      });
    });

    it("returns step1", () => {
      expect(buildFlowController({ config }).getLastReachable()).toStrictEqual({
        name: "step1",
        url: "/test/flow/step1",
      });
    });
  });

  describe("getProgress", () => {
    it("returns 5/5", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getProgress("step5"),
      ).toStrictEqual({
        current: 5,
        total: 5,
      });
    });

    it("returns 3/5", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: true },
        }).getProgress("step3"),
      ).toStrictEqual({
        current: 3,
        total: 5,
      });
    });

    // TODO: We ignore nested steps for now, we have to fix the getProgress function to include nested steps.
    it("returns 1/5", () => {
      expect(
        buildFlowController({ config }).getProgress("step1"),
      ).toStrictEqual({
        current: 1,
        total: 5,
      });
    });

    it("returns 5/5 for final step", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: false },
        }).getProgress("step1Exit"),
      ).toStrictEqual({
        current: 5,
        total: 5,
      });
    });

    it("returns 2/5 even if data doesn't fit", () => {
      expect(
        buildFlowController({
          config,
          data: { step1: false },
        }).getProgress("step2"),
      ).toStrictEqual({
        current: 2,
        total: 5,
      });
    });
  });
});

import { buildFlowController } from "~/services/flow/buildFlowController";

const flow: Parameters<typeof buildFlowController>[0]["flow"] = {
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
    step3: { on: { BACK: { target: "step2" } } },
  },
};

describe("buildFlowController", () => {
  describe("isInitial", () => {
    it("returns true if initial step", () => {
      expect(buildFlowController({ flow }).isInitial("step1")).toBe(true);
    });

    it("returns false if not intial step", () => {
      expect(buildFlowController({ flow }).isInitial("step2")).toBe(false);
    });
  });

  describe("isFinal", () => {
    it("returns true if final step", () => {
      expect(buildFlowController({ flow }).isFinal("step1Exit")).toBe(true);
    });

    it("returns true if final step but SUBMIT given as empty array", () => {
      expect(
        buildFlowController({
          flow: {
            predictableActionArguments: true,
            id: "/flow/final/",
            initial: "step1",
            states: {
              step1: { on: { SUBMIT: [], BACK: { target: "step0" } } },
            },
          },
        }).isFinal("step1"),
      ).toBe(true);
    });

    it("returns true if final step but SUBMIT given as empty object", () => {
      expect(
        buildFlowController({
          flow: {
            predictableActionArguments: true,
            id: "/flow/final/",
            initial: "step1",
            states: {
              step1: { on: { SUBMIT: {}, BACK: { target: "step0" } } },
            },
          },
        }).isFinal("step1"),
      ).toBe(true);
    });

    it("returns false if not final step", () => {
      expect(buildFlowController({ flow }).isFinal("step1")).toBe(false);
    });
  });

  describe("isReachable", () => {
    it("returns true if step is reachable with given data", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
        }).isReachable("step3"),
      ).toBe(true);
    });

    it("returns false if step is not reachable", () => {
      expect(buildFlowController({ flow }).isReachable("step3")).toBe(false);
    });
  });

  describe("getPrevious", () => {
    it("returns previous step (step2) if data is correct", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
        }).getPrevious("step3"),
      ).toStrictEqual({
        name: "step2",
        url: "/test/flow/step2",
      });
    });

    it("returns undefined if already first step", () => {
      expect(
        buildFlowController({ flow }).getPrevious("step1"),
      ).toBeUndefined();
    });
  });

  describe("getNext", () => {
    it("returns step2", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
        }).getNext("step1"),
      ).toStrictEqual({
        name: "step2",
        url: "/test/flow/step2",
      });
    });

    it("throws error if already last step", () => {
      expect(() =>
        buildFlowController({
          flow,
          data: { step1: true },
        }).getNext("step3"),
      ).toThrow();
    });
  });

  describe("getInitial", () => {
    it("returns step1", () => {
      expect(buildFlowController({ flow }).getInitial()).toStrictEqual({
        name: "step1",
        url: "/test/flow/step1",
      });
    });
  });

  describe("getLastReachable", () => {
    it("returns step3", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
        }).getLastReachable(),
      ).toStrictEqual({
        name: "step3",
        url: "/test/flow/step3",
      });
    });

    it("returns step1", () => {
      expect(buildFlowController({ flow }).getLastReachable()).toStrictEqual({
        name: "step1",
        url: "/test/flow/step1",
      });
    });
  });

  describe("getProgress", () => {
    it("returns 3/3", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
        }).getProgress("step3"),
      ).toStrictEqual({
        current: 3,
        total: 3,
      });
    });

    it("returns 1/3", () => {
      expect(buildFlowController({ flow }).getProgress("step1")).toStrictEqual({
        current: 1,
        total: 3,
      });
    });

    it("returns 3/3 for final step", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: false },
        }).getProgress("step1Exit"),
      ).toStrictEqual({
        current: 3,
        total: 3,
      });
    });

    it("returns 2/3 even if data doesn't fit", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: false },
        }).getProgress("step2"),
      ).toStrictEqual({
        current: 2,
        total: 3,
      });
    });
  });
});

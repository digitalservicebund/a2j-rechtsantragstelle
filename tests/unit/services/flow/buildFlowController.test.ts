import type { MachineConfig } from "xstate";
import { buildFlowController } from "~/services/flow/buildFlowController";

const flow: MachineConfig<any, any, any> = {
  id: "/flow/vorabcheck/",
  initial: "step1",
  states: {
    step1: {
      meta: { progressPosition: 1 },
      on: {
        SUBMIT: [
          {
            target: "step1Exit",
            cond: (context) => context.step1 === false,
          },
          {
            target: "step2",
            cond: (context) => context.step1 === true,
          },
        ],
      },
    },
    step1Exit: {
      on: {
        BACK: { target: "step1" },
      },
    },
    step2: {
      meta: { progressPosition: 2 },
      on: {
        SUBMIT: [
          {
            target: "step3",
          },
        ],
        BACK: { target: "step1" },
      },
    },
    step3: {
      on: {
        BACK: { target: "step2" },
      },
    },
  },
};

describe("buildFlowController", () => {
  describe("isInitial", () => {
    it("returns true if initial step", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step1",
        }).isInitial()
      ).toBe(true);
    });

    it("returns false if not intial step", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step2",
        }).isInitial()
      ).toBe(false);
    });
  });

  describe("isFinal", () => {
    it("returns true if final step", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step1Exit",
        }).isFinal()
      ).toBe(true);
    });

    it("returns false if not final step", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step1",
        }).isFinal()
      ).toBe(false);
    });
  });

  describe("isReachable", () => {
    it("returns true if step is reachable with given data", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
          currentStepId: "step3",
        }).isReachable()
      ).toBe(true);
    });

    it("returns false if step is not reachable", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step3",
        }).isReachable()
      ).toBe(false);
    });
  });

  describe("getPrevious", () => {
    it("returns previous step (step2) if data is correct", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
          currentStepId: "step3",
        }).getPrevious()
      ).toStrictEqual({
        name: "step2",
        url: "/flow/vorabcheck/step2",
      });
    });

    it("throws error if already first step", () => {
      expect(() =>
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step1",
        }).getPrevious()
      ).toThrow();
    });
  });

  describe("getNext", () => {
    it("returns step2", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
          currentStepId: "step1",
        }).getNext()
      ).toStrictEqual({
        name: "step2",
        url: "/flow/vorabcheck/step2",
      });
    });

    it("throws error if already last step", () => {
      expect(() =>
        buildFlowController({
          flow,
          data: { step1: true },
          currentStepId: "step3",
        }).getNext()
      ).toThrow();
    });
  });

  describe("getInitial", () => {
    it("returns step1", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step3",
        }).getInitial()
      ).toStrictEqual({
        name: "step1",
        url: "/flow/vorabcheck/step1",
      });
    });
  });

  describe("getLastReachable", () => {
    it("returns step3", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
          currentStepId: "step1",
        }).getLastReachable()
      ).toStrictEqual({
        name: "step3",
        url: "/flow/vorabcheck/step3",
      });
    });

    it("returns step1", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step1",
        }).getLastReachable()
      ).toStrictEqual({
        name: "step1",
        url: "/flow/vorabcheck/step1",
      });
    });
  });

  describe("getProgress", () => {
    it("returns 3/3", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: true },
          currentStepId: "step3",
        }).getProgress()
      ).toStrictEqual({
        current: 3,
        total: 3,
      });
    });

    it("returns 1/3", () => {
      expect(
        buildFlowController({
          flow,
          data: {},
          currentStepId: "step1",
        }).getProgress()
      ).toStrictEqual({
        current: 1,
        total: 3,
      });
    });

    it("returns 3/3 for final step", () => {
      expect(
        buildFlowController({
          flow,
          data: { step1: false },
          currentStepId: "step1Exit",
        }).getProgress()
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
          currentStepId: "step2",
        }).getProgress()
      ).toStrictEqual({
        current: 2,
        total: 3,
      });
    });
  });
});

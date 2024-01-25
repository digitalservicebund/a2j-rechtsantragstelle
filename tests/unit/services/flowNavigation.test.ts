import {
  navItemsFromFlowSpecifics,
  navState,
  NavState,
} from "~/services/flowNavigation";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import _ from "lodash";

describe("flowNavigation", () => {
  describe("navState", () => {
    const defaultValues = {
      isCurrent: false,
      isReachable: false,
      isDone: false,
      isUneditable: false,
    };

    const validStates = [
      [{}, NavState.OpenDisabled],
      [{ isCurrent: true }, NavState.Current],
      [{ isReachable: true }, NavState.Open],
      [{ isDone: true, isReachable: true }, NavState.Done],
      [{ isDone: true, isUneditable: true }, NavState.DoneDisabled],
    ] as const;

    test.each(validStates)("navState(%o) => %i", (testValues, expected) => {
      expect(navState({ ...defaultValues, ...testValues })).toBe(expected);
    });
  });

  describe("flow to NavState", () => {
    const flow = {
      id: "/test/flow/",
      initial: "step1",
      predictableActionArguments: true,
      states: {
        step1: {
          initial: "step1a",
          states: { step1a: {} },
        },
        step2: {},
      },
    };

    describe("checks open state", () => {
      const flowController = buildFlowController({ flow });
      expect(
        navItemsFromFlowSpecifics("step1.step1a", flowController)[0].state,
      ).toBe(NavState.Current);

      expect(navItemsFromFlowSpecifics("step2", flowController)[0].state).toBe(
        NavState.Open,
      );
    });

    describe("checks done state", () => {
      const flowController = buildFlowController({
        flow: _.merge(_.cloneDeep(flow), {
          states: { step1: { meta: { done: () => true } } },
        }),
      });

      expect(
        navItemsFromFlowSpecifics("step1.step1a", flowController)[0].state,
      ).toBe(NavState.Current);

      expect(navItemsFromFlowSpecifics("step2", flowController)[0].state).toBe(
        NavState.Done,
      );
    });

    describe("works with isUneditable", () => {
      const flowController = buildFlowController({
        flow: _.merge(_.cloneDeep(flow), {
          states: { step1: { meta: { isUneditable: true, done: () => true } } },
        }),
      });

      expect(
        navItemsFromFlowSpecifics("step1.step1a", flowController)[0].state,
      ).toBe(NavState.Current);

      expect(navItemsFromFlowSpecifics("step2", flowController)[0].state).toBe(
        NavState.DoneDisabled,
      );
    });

    describe("checks open state", () => {
      const flowController = buildFlowController({
        flow: _.merge(_.cloneDeep(flow), {
          states: {
            step2: {
              initial: "step2a",
              states: { step2a: {} },
            },
          },
        }),
      });

      expect(
        navItemsFromFlowSpecifics("step1.step1a", flowController)[0].state,
      ).toBe(NavState.Current);
      expect(
        navItemsFromFlowSpecifics("step1.step1a", flowController)[1].state,
      ).toBe(NavState.OpenDisabled);
    });
  });
});

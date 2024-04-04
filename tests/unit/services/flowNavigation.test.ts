import {
  navItemsFromDoneStates,
  navState,
} from "~/services/flowNavigation.server";
import { NavState } from "~/components/FlowNavigation";
import invariant from "tiny-invariant";

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

  describe("navItemsFromDoneStates()", () => {
    const parentDoneState = {
      url: "/step1",
      isDone: false,
      stepId: "step1",
      isUneditable: false,
      isReachable: true,
    };
    const childDoneState = {
      url: "/step1/a",
      isDone: false,
      stepId: "step1/a",
      isUneditable: false,
      isReachable: true,
    };

    const doneStatesNested = [
      { ...parentDoneState, subStates: [childDoneState] },
    ];

    it("IsCurrent as child", () => {
      expect(
        navItemsFromDoneStates("step1/start", [parentDoneState]),
      ).toStrictEqual([
        {
          destination: parentDoneState.url,
          label: parentDoneState.stepId,
          state: NavState.Current,
          subflows: undefined,
        },
      ]);
    });

    it("IsCurrent is set for parent", () => {
      expect(
        navItemsFromDoneStates("step1/a/start", doneStatesNested),
      ).toStrictEqual([
        {
          destination: parentDoneState.url,
          label: parentDoneState.stepId,
          state: NavState.Current,
          subflows: [
            {
              label: childDoneState.stepId,
              destination: childDoneState.url,
              state: NavState.Current,
              subflows: undefined,
            },
          ],
        },
      ]);
    });

    it("does label lookup", () => {
      const navItems = navItemsFromDoneStates(
        "step1/a/start",
        doneStatesNested,
        {
          step1: "Parent",
          "step1/a": "Child",
        },
      );
      invariant(navItems);
      invariant(navItems[0].subflows);
      expect(navItems[0].label).toBe("Parent");
      expect(navItems[0].subflows[0].label).toBe("Child");
    });
  });
});

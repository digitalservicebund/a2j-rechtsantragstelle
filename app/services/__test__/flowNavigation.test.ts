import invariant from "tiny-invariant";
import {
  navItemsFromStepStates,
  navState,
} from "~/services/flowNavigation.server";

describe("flowNavigation", () => {
  describe("navState", () => {
    const defaultValues = {
      isCurrent: false,
      isReachable: false,
      isDone: false,
    };

    const validStates = [
      [{}, "Disabled"],
      [{ isCurrent: true }, "Current"],
      [{ isReachable: true }, "Open"],
      [{ isDone: true, isReachable: true }, "Done"],
    ] as const;

    test.each(validStates)("navState(%o) => %i", (testValues, expected) => {
      expect(navState({ ...defaultValues, ...testValues })).toBe(expected);
    });
  });

  describe("navItemsFromStepStates()", () => {
    const parentStepState = {
      url: "/step1",
      isDone: false,
      stepId: "step1",
      isReachable: true,
    };
    const childStepState = {
      url: "/step1/a",
      isDone: false,
      stepId: "step1/a",
      isReachable: true,
    };

    const stepStatesNested = [
      { ...parentStepState, subStates: [childStepState] },
    ];

    it("parents' IsCurrent true if in child state", () => {
      expect(
        navItemsFromStepStates("step1/start", [parentStepState]),
      ).toStrictEqual([
        {
          destination: parentStepState.url,
          label: parentStepState.stepId,
          state: "Current",
          subflows: undefined,
        },
      ]);
    });

    it("nested parents IsCurrent true if in nested child state", () => {
      expect(
        navItemsFromStepStates("step1/a/start", stepStatesNested),
      ).toStrictEqual([
        {
          destination: parentStepState.url,
          label: parentStepState.stepId,
          state: "Current",
          subflows: [
            {
              label: childStepState.stepId,
              destination: childStepState.url,
              state: "Current",
              subflows: undefined,
            },
          ],
        },
      ]);
    });

    it("nested parents IsCurrent false if not in nested child state", () => {
      expect(
        navItemsFromStepStates("step1/b/start", stepStatesNested),
      ).toStrictEqual([
        {
          destination: parentStepState.url,
          label: parentStepState.stepId,
          state: "Open",
          subflows: [
            {
              label: childStepState.stepId,
              destination: childStepState.url,
              state: "Open",
              subflows: undefined,
            },
          ],
        },
      ]);
    });

    it("does label lookup", () => {
      const navItems = navItemsFromStepStates(
        "step1/a/start",
        stepStatesNested,
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

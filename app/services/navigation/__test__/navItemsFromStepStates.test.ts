import invariant from "tiny-invariant";
import { navItemsFromStepStates } from "~/services/navigation/navItemsFromStepStates";

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
    const navItems = navItemsFromStepStates("step1/a/start", stepStatesNested, {
      step1: "Parent",
      "step1/a": "Child",
    });
    invariant(navItems);
    invariant(navItems[0].subflows);
    expect(navItems[0].label).toBe("Parent");
    expect(navItems[0].subflows[0].label).toBe("Child");
  });

  it("only has one current", () => {
    expect(
      navItemsFromStepStates("/a-b/b", [
        {
          url: "/",
          isDone: true,
          stepId: "/a",
          isReachable: true,
        },
        {
          url: "/",
          isDone: false,
          stepId: "/a-b",
          isReachable: true,
        },
      ]),
    ).toStrictEqual([
      {
        destination: "/",
        label: "/a",
        subflows: undefined,
        state: "Done",
      },
      {
        destination: "/",
        label: "/a-b",
        subflows: undefined,
        state: "Current",
      },
    ]);
  });

  it('should have the correct "current" status if the step is a top-level step', () => {
    expect(
      navItemsFromStepStates("/a-b", [
        {
          url: "/",
          isDone: false,
          stepId: "/a-b",
          isReachable: true,
        },
      ]),
    ).toStrictEqual([
      {
        destination: "/",
        label: "/a-b",
        subflows: undefined,
        state: "Current",
      },
    ]);
  });
});

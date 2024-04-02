import { navState } from "~/services/flowNavigation.server";
import { NavState } from "~/components/FlowNavigation";

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
});

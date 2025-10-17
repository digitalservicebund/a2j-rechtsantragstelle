import { navState } from "../navState";

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

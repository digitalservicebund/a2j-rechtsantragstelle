import {
  navState,
  navStateStepper,
  stateIsActive,
  stateIsCurrent,
  stateIsWarning,
} from "../navState";

describe("navState", () => {
  it("should return state Disabled in case isCurrent, isReachable, isDone are false", () => {
    const actual = navState({
      isCurrent: false,
      isDone: false,
      isReachable: false,
    });

    expect(actual).toBe("Disabled");
  });

  it("should return state Current in case isCurrent is true and isDone is false", () => {
    const actual = navState({
      isCurrent: true,
      isDone: false,
      isReachable: false,
    });

    expect(actual).toBe("Current");
  });

  it("should return state Open in case isCurrent and isDone are false, but isReachable is true", () => {
    const actual = navState({
      isCurrent: false,
      isDone: false,
      isReachable: true,
    });

    expect(actual).toBe("Open");
  });

  it("should return state Done in case isReachable and isDone true, but isCurrent is false", () => {
    const actual = navState({
      isCurrent: false,
      isDone: true,
      isReachable: true,
    });

    expect(actual).toBe("Done");
  });

  it("should return state DoneCurrent in case isCurrent and isDone true", () => {
    const actual = navState({
      isCurrent: true,
      isDone: true,
      isReachable: false,
    });

    expect(actual).toBe("DoneCurrent");
  });

  it("should return state WarningCurrent in case userVisitedValidationPage, isCurrent and isReachable are true, but excludedFromValidation and isDone are false", () => {
    const actual = navState({
      isCurrent: true,
      isDone: false,
      isReachable: true,
      excludedFromValidation: false,
      userVisitedValidationPage: true,
    });

    expect(actual).toBe("WarningCurrent");
  });

  it("should return state Warning in case userVisitedValidationPage and isReachable are true, but excludedFromValidation, isCurrent isDone are false", () => {
    const actual = navState({
      isCurrent: false,
      isDone: false,
      isReachable: true,
      excludedFromValidation: false,
      userVisitedValidationPage: true,
    });

    expect(actual).toBe("Warning");
  });
});

describe("stateIsCurrent", () => {
  const caseIsCurrentStates = [
    { state: "Done", expected: false },
    { state: "DoneCurrent", expected: true },
    { state: "Current", expected: true },
    { state: "Open", expected: false },
    { state: "Disabled", expected: false },
    { state: "Warning", expected: false },
    { state: "WarningCurrent", expected: true },
  ] as const;

  test.each(caseIsCurrentStates)(
    "should return $expected for the state $state",
    ({ expected, state }) => {
      const actual = stateIsCurrent(state);
      expect(actual).toBe(expected);
    },
  );
});

describe("stateIsActive", () => {
  const casesIsActive = [
    { state: "Done", expected: true },
    { state: "DoneCurrent", expected: true },
    { state: "Current", expected: true },
    { state: "Open", expected: true },
    { state: "Disabled", expected: false },
    { state: "Warning", expected: true },
    { state: "WarningCurrent", expected: true },
  ] as const;

  test.each(casesIsActive)(
    "should return $expected for the state $state",
    ({ expected, state }) => {
      const actual = stateIsActive(state);
      expect(actual).toBe(expected);
    },
  );
});

describe("stateIsWarning", () => {
  const caseIsWarning = [
    { state: "Done", expected: false },
    { state: "DoneCurrent", expected: false },
    { state: "Current", expected: false },
    { state: "Open", expected: false },
    { state: "Disabled", expected: false },
    { state: "Warning", expected: true },
    { state: "WarningCurrent", expected: true },
  ] as const;

  test.each(caseIsWarning)(
    "should return $expected for the state $state",
    ({ expected, state }) => {
      const actual = stateIsWarning(state);
      expect(actual).toBe(expected);
    },
  );
});

describe("navStateStepper", () => {
  it("should return Done if all the states are done", () => {
    const statesDone = ["Done" as const, "Done" as const, "Done" as const];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("Done");
  });

  it("should return DoneCurrent if all the states are done, but one state is DoneCurrent", () => {
    const statesDone = [
      "Done" as const,
      "Done" as const,
      "DoneCurrent" as const,
    ];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("DoneCurrent");
  });

  it("should return Warning if one state is Warning", () => {
    const statesDone = ["Done" as const, "Done" as const, "Warning" as const];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("Warning");
  });

  it("should return WarningCurrent if one state is WarningCurrent", () => {
    const statesDone = [
      "Done" as const,
      "Warning" as const,
      "WarningCurrent" as const,
    ];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("WarningCurrent");
  });

  it("should return Disabled if all the states are disabled", () => {
    const statesDone = [
      "Disabled" as const,
      "Disabled" as const,
      "Disabled" as const,
    ];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("Disabled");
  });

  it("should return Open if all the states are opened", () => {
    const statesDone = ["Open" as const, "Open" as const, "Open" as const];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("Open");
  });

  it("should return Current if at least one state is current", () => {
    const statesDone = ["Open" as const, "Open" as const, "Current" as const];

    const actual = navStateStepper(statesDone);
    expect(actual).toBe("Current");
  });
});

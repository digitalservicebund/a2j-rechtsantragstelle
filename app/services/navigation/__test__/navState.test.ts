import { navState } from "../navState";

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

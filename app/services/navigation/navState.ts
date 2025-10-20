export type NavState =
  | "Done"
  | "DoneCurrent"
  | "Current"
  | "Open"
  | "Disabled"
  | "Warning"
  | "WarningCurrent";

export function navState({
  isCurrent,
  isReachable,
  isDone,
  userVisitedValidationPage,
  excludedFromValidation,
}: {
  isCurrent: boolean;
  isReachable: boolean;
  isDone: boolean;
  userVisitedValidationPage?: boolean;
  excludedFromValidation?: boolean;
}): NavState {
  if (
    userVisitedValidationPage &&
    !excludedFromValidation &&
    !isDone &&
    isReachable
  ) {
    return isCurrent ? "WarningCurrent" : "Warning";
  }

  if (isCurrent && isDone) return "DoneCurrent";
  if (isCurrent) return "Current";
  if (isReachable && isDone) return "Done";
  if (isReachable) return "Open";

  return "Disabled";
}

export const stateIsCurrent = (state: NavState) =>
  ["Current", "DoneCurrent", "WarningCurrent"].includes(state);

export const stateIsActive = (state: NavState) => state !== "Disabled";

export const stateIsDone = (state: NavState) =>
  state === "Done" || state === "DoneCurrent";

export const stateIsWarning = (state: NavState) =>
  state === "Warning" || state === "WarningCurrent";

export const stateIsDisabled = (state: NavState) => state === "Disabled";

export const stateIsWarning = (state: NavState) =>
  state === "Warning" || state === "WarningCurrent";

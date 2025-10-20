export type NavState =
  | "Done"
  | "DoneCurrent"
  | "Current"
  | "Open"
  | "Disabled"
  | "Warning"
  | "WarningCurrent";

export const stateIsCurrent = (state: NavState) =>
  ["Current", "DoneCurrent", "WarningCurrent"].includes(state);

export const stateIsActive = (state: NavState) =>
  ["DoneCurrent", "Current", "Open", "Done"].includes(state);

export const stateIsDone = (state: NavState) =>
  state === "Done" || state === "DoneCurrent";

export const stateIsDisabled = (state: NavState) => state === "Disabled";

export const stateIsWarning = (state: NavState) =>
  state === "Warning" || state === "WarningCurrent";

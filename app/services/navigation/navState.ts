export type NavState = "Done" | "DoneCurrent" | "Current" | "Open" | "Disabled";

export const stateIsCurrent = (state: NavState) =>
  state === "Current" || state === "DoneCurrent";

export const stateIsActive = (state: NavState) =>
  ["DoneCurrent", "Current", "Open", "Done"].includes(state);

export const stateIsDone = (state: NavState) =>
  state === "Done" || state === "DoneCurrent";

export const stateIsDisabled = (state: NavState) => state === "Disabled";

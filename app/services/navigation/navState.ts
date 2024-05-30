export enum NavState {
  DoneDisabled,
  Done,
  DoneCurrent,
  Current,
  Open,
  OpenDisabled,
}

export const stateIsCurrent = (state: NavState) =>
  state === NavState.Current || state === NavState.DoneCurrent;

export const stateIsActive = (state: NavState) =>
  [
    NavState.DoneCurrent,
    NavState.Current,
    NavState.Open,
    NavState.Done,
  ].includes(state);

export const stateIsDone = (state: NavState) =>
  state === NavState.DoneDisabled ||
  state === NavState.Done ||
  state === NavState.DoneCurrent;

export const stateIsDisabled = (state: NavState) =>
  state === NavState.DoneDisabled || state === NavState.OpenDisabled;

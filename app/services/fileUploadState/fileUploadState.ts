export enum FileUploadState {
  NotStarted,
  InProgress,
  Done,
  Disabled,
}

export const stateIsDone = (state: FileUploadState) =>
  state === FileUploadState.Done;
export const stateIsDisabled = (state: FileUploadState) =>
  state === FileUploadState.Disabled;
export const stateIsInProgress = (state: FileUploadState) =>
  state === FileUploadState.InProgress;
export const stateIsNotStarted = (state: FileUploadState) =>
  state === FileUploadState.NotStarted;

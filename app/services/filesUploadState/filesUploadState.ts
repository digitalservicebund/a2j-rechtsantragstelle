export enum FilesUploadState {
  NotStarted,
  InProgress,
  Done,
  Disabled,
}

export const stateIsDone = (state: FilesUploadState) =>
  state === FilesUploadState.Done;
export const stateIsDisabled = (state: FilesUploadState) =>
  state === FilesUploadState.Disabled;
export const stateIsInProgress = (state: FilesUploadState) =>
  state === FilesUploadState.InProgress;
export const stateIsNotStarted = (state: FilesUploadState) =>
  state === FilesUploadState.NotStarted;

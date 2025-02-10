import { FC } from "react";
import { FilesUploadDone } from "./FilesUploadDone";
import { FilesUploadError } from "./FilesUploadError";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { FilesUploadInProgress } from "./FilesUploadInProgress";
import { FilesUploadInput } from "./FilesUploadInput";
import { FilesUploadWarning } from "./FilesUploadWarning";

export enum FilesUploadState {
  NotStarted = "notStarted",
  InProgress = "inProgress",
  Done = "done",
  Disabled = "disabled",
  Error = "error",
  Warning = "warning",
}

export type FilesUploadProps = {
  title: string;
  fieldName: string;
  fileNames: string[];
  fileSizes: number[];
  description?: string;
  warningTitle: string;
  errorMessage: string;
  cancelButtonLabel: string;
  deleteButtonLabel: string;
  warningDescription: string;
  uploadProgressLabel: string;
  selectFilesButtonLabel: string;
  selectMoreFilesButtonLabel: string;
};

export const FilesUpload: FC<FilesUploadProps> = ({
  title,
  fileNames,
  fileSizes,
  fieldName,
  description,
  errorMessage,
  warningTitle,
  cancelButtonLabel,
  deleteButtonLabel,
  warningDescription,
  uploadProgressLabel,
  selectFilesButtonLabel,
  selectMoreFilesButtonLabel,
}) => {
  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />

      {FilesUploadState.NotStarted && (
        <>
          <FilesUploadInput
            selectFilesButtonLabel={selectFilesButtonLabel}
            fieldName={fieldName}
          />
          {FilesUploadState.Error && (
            <FilesUploadError errorMessage={errorMessage} />
          )}
        </>
      )}

      {FilesUploadState.InProgress && (
        <FilesUploadInProgress
          fileNames={fileNames}
          uploadProgressLabel={uploadProgressLabel}
          cancelButtonLabel={cancelButtonLabel}
          selectMoreFilesButtonLabel={selectMoreFilesButtonLabel}
        />
      )}

      {FilesUploadState.Done && (
        <>
          <FilesUploadDone
            fileNames={fileNames}
            fileSizes={fileSizes}
            deleteButtonLabel={deleteButtonLabel}
            selectMoreFilesButtonLabel={selectMoreFilesButtonLabel}
          />
          {FilesUploadState.Warning && (
            <FilesUploadWarning
              warningTitle={warningTitle}
              warningDescription={warningDescription}
            />
          )}
        </>
      )}
    </div>
  );
};

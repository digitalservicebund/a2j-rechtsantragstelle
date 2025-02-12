import { FC } from "react";
import { FileUploadDone } from "./FileUploadDone";
import { FileUploadInProgress } from "./FileUploadInProgress";

export enum SingleFileUploadState {
  InProgress = "inProgress",
  Done = "done",
}

type SingleFileUploadProps = {
  file: File;
  uploadProgressLabel: string;
  cancelButtonLabel: string;
  deleteButtonLabel: string;
  uploadFileState: SingleFileUploadState
};

export const SingleFileUpload: FC<SingleFileUploadProps> = ({
  file,
  uploadProgressLabel,
  cancelButtonLabel,
  deleteButtonLabel,
  uploadFileState
}) => {

  return (
    <>
      {uploadFileState === SingleFileUploadState.InProgress && file &&(
        <FileUploadInProgress
          key={file.name}
          fileName={file.name}
          uploadProgressLabel={uploadProgressLabel}
          cancelButtonLabel={cancelButtonLabel}
        />
      )}
      {uploadFileState === SingleFileUploadState.Done && file && (
        <FileUploadDone
          key={file.name}
          fileName={file.name}
          fileSize={file.size}
          deleteButtonLabel={deleteButtonLabel}
        />
      )}
    </>
  );
};

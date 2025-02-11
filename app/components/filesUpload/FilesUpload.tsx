import { FC, useState } from "react";
import { FilesUploadDone } from "./FilesUploadDone";
import { FilesUploadError } from "./FilesUploadError";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { FilesUploadInProgress } from "./FilesUploadInProgress";
import { FilesUploadInput } from "./FilesUploadInput";
import { FilesUploadWarning } from "./FilesUploadWarning";

 enum FilesUploadState {
  NotStarted = "notStarted",
  InProgress = "inProgress",
  Done = "done",
  Error = "error",
  Warning = "warning",
}

type FilesUploadProps = {
  title: string;
  inputName: string;
  uploadFile: (file: File) => Promise<void>;
  description?: string;
  warningTitle: string;
  cancelButtonLabel: string;
  deleteButtonLabel: string;
  warningDescription: string;
  uploadProgressLabel: string;
  selectFilesButtonLabel: string;
  selectMoreFilesButtonLabel: string;
};

export const FilesUpload: FC<FilesUploadProps> = ({
  title,
  inputName,
  description,
  uploadFile,
  selectFilesButtonLabel,
  uploadProgressLabel,
  cancelButtonLabel,
  deleteButtonLabel,
  warningTitle,
  warningDescription,
  selectMoreFilesButtonLabel,  
}) => {
  

  const [uploadState, setUploadState] = useState<FilesUploadState>(FilesUploadState.NotStarted);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (file: File): void => {
    setFile(file);
    setUploadState(FilesUploadState.InProgress);
    uploadFile(file)
      .then(() => {
        setUploadState(FilesUploadState.Done);
      })
      .catch(() => {
        setUploadState(FilesUploadState.Error);
        setErrorMessage("Upload failed");
  });
  };  
  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />

      {uploadState === FilesUploadState.NotStarted && (
        <>
          <FilesUploadInput
            selectFilesButtonLabel={selectFilesButtonLabel}
            inputName={inputName} 
            onFileSelect={handleFileSelect}      
            />
        </>
      )}
      
      {uploadState === FilesUploadState.Error && errorMessage !== null && (
        <FilesUploadError errorMessage={errorMessage} />
      )}

      {uploadState === FilesUploadState.InProgress && file !== null &&(
        <FilesUploadInProgress
          fileName={file.name}
          uploadProgressLabel={uploadProgressLabel}
          cancelButtonLabel={cancelButtonLabel}
          selectMoreFilesButtonLabel={selectMoreFilesButtonLabel}
        />
      )}

      {uploadState === FilesUploadState.Done && file !== null && (
        <>
          <FilesUploadDone
            fileName={file.name}
            fileSize={file.size}
            deleteButtonLabel={deleteButtonLabel}
            selectMoreFilesButtonLabel={selectMoreFilesButtonLabel}
          />
        </>
      )}
      {uploadState === FilesUploadState.Warning && (
            <FilesUploadWarning
              warningTitle={warningTitle}
              warningDescription={warningDescription}
            />
          )}
    </div>
  );
};

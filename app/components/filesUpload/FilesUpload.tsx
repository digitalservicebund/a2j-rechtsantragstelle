import AddIcon from "@digitalservicebund/icons/Add";
import { FC, useState } from "react";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { FileUploadError } from "./FileUploadError";
import { FileUploadInput } from "./FileUploadInput";
import { FileUploadWarning } from "./FileUploadWarning";
import Button from "../Button";
import { SingleFileUpload, SingleFileUploadState } from "./SingleFileUpload";

enum FilesUploadComponentState {
  Ongoing = "ongoing",
  NotStarted = "notStarted",
  Warning = "warning",
}

type FilesUploadProps = {
  title: string;
  inputName: string;
  uploadFile: (file: File) => Promise<void>;
  description?: string;
  warningTitle: string;
  warningDescription: string;
  labels: {
    cancelButtonLabel: string;
    deleteButtonLabel: string;
    uploadProgressLabel: string;
    selectFilesButtonLabel: string;
    selectMoreFilesButtonLabel: string;
  };
};

export const FilesUpload: FC<FilesUploadProps> = ({
  title,
  inputName,
  description,
  uploadFile,
  labels,
  warningTitle,
  warningDescription,
}) => {
  const [uploadComponentState, setUploadComponentState] =
    useState<FilesUploadComponentState>(FilesUploadComponentState.NotStarted);
  const [uploadFileState, setUploadFileState] = useState<SingleFileUploadState>(
    SingleFileUploadState.Done,
  );

  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const warningFilesLimit = 5;

  const handleFileSelect = (file: File): void => {
    //check more files
    setFiles([file]);
    setUploadComponentState(FilesUploadComponentState.Ongoing);
    setUploadFileState(SingleFileUploadState.InProgress);
    uploadFile(file)
      .then(() => {
        if (files.length > warningFilesLimit) {
          setUploadComponentState(FilesUploadComponentState.Warning);
        }
        setUploadFileState(SingleFileUploadState.Done);
      })
      .catch(() => {
        setErrorMessage("Upload failed");
      });
  };
  // adapt for no js
  // render a list of files
  // DONE render a warning message when file limit reached
  // DONE make add more files button disappear when file limit reached
  // add easy functionality to add more files button
  // add easy functionality to delete button
  // add easy functionality to cancel button
  // add a11 things to like in the Input.js component (at the moment I get an error on storybook when I add that)

  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />

      {uploadComponentState === FilesUploadComponentState.NotStarted && (
        <FileUploadInput
          selectFilesButtonLabel={labels.selectFilesButtonLabel}
          inputName={inputName}
          onFileSelect={handleFileSelect}
        />
      )}

      {files.map((file) => (
        <SingleFileUpload
          key={file.name}
          file={file}
          uploadProgressLabel={labels.uploadProgressLabel}
          cancelButtonLabel={labels.cancelButtonLabel}
          deleteButtonLabel={labels.deleteButtonLabel}
          uploadFileState={uploadFileState}
        />
      ))}

      {uploadComponentState === FilesUploadComponentState.Warning && (
        <FileUploadWarning
          warningTitle={warningTitle}
          warningDescription={warningDescription}
        />
      )}

      {uploadComponentState === FilesUploadComponentState.NotStarted &&
        errorMessage && <FileUploadError errorMessage={errorMessage} />}

      {uploadComponentState === FilesUploadComponentState.Ongoing && (
        <Button
          iconLeft={<AddIcon className="w-6 h-6" />}
          text={labels.selectMoreFilesButtonLabel}
        />
      )}
    </div>
  );
};

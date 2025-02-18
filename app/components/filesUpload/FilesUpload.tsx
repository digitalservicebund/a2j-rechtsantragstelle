import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import { FC, useState } from "react";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { FileUploadError } from "./FileUploadError";
import { FileUploadInfo } from "./FileUploadInfo";
import { FileUploadInput } from "./FileUploadInput";
import { FileUploadWarning } from "./FileUploadWarning";
import Button from "../Button";

enum FilesUploadComponentState {
  Done = "done",
  NotStarted = "notStarted",
  Warning = "warning",
}

type FilesUploadProps = {
  title: string;
  inputName: string;
  uploadFile: (file: File) => Promise<unknown>;
  description?: string;
  warningTitle: string;
  warningDescription: string;
  labels: {
    deleteButtonLabel: string;
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
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  const uploadFilesLimit = 5;

  const handleFileSelect = (files: File[]): void => {
    const selectedFiles = files.slice(0, uploadFilesLimit);
    Promise.all(selectedFiles.map((file) => uploadFile(file)))
      .then(() => {
        setFiles(selectedFiles);
        if (files.length > uploadFilesLimit) {
          setUploadComponentState(FilesUploadComponentState.Warning);
        } else {
          setUploadComponentState(FilesUploadComponentState.Done);
        }
      })
      .catch(() => {
        setFiles(selectedFiles);
        setErrorMessage("Upload failed");
      });
  };

  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />

      {files.map((file) => (
        <div key={file.name}>
          <div
            className={`w-full h-64 ${errorMessage ? "bg-red-200 border-2 border-red-900" : "bg-gray-100"} flex justify-between items-center px-16 my-14`}
          >
            <FileUploadInfo fileName={file.name} fileSize={file.size} />
            <Button
              iconLeft={<DeleteIcon className="shrink-0" />}
              look="ghost"
              text={labels.deleteButtonLabel}
              onClick={() =>
                setFiles(files.filter((f) => f.name !== file.name))
              }
            />
          </div>
          <div>
            {errorMessage && <FileUploadError errorMessage={errorMessage} />}
          </div>
        </div>
      ))}

      {uploadComponentState === FilesUploadComponentState.Warning ? (
        <FileUploadWarning
          warningTitle={warningTitle}
          warningDescription={warningDescription}
        />
      ) : (
        <FileUploadInput
          selectFilesButtonLabel={
            uploadComponentState === FilesUploadComponentState.NotStarted
              ? labels.selectFilesButtonLabel
              : labels.selectMoreFilesButtonLabel
          }
          inputName={inputName}
          onFileSelect={handleFileSelect}
        />
      )}
    </div>
  );
};

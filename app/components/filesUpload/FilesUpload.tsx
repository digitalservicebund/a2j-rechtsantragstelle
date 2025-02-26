import { useState, useEffect } from "react";
import { FileInputsNoJS } from "./FileInputsNoJS";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { FileUploadError } from "./FileUploadError";
import { FileUploadInfo } from "./FileUploadInfo";
import { FileUploadWarning } from "./FileUploadWarning";
import { FileInput } from "../inputs/FileInput";

export type FilesUploadProps = {
  name: string;
  title?: string;
  formId?: string;
  fileName?: string;
  fileSize?: number;
  warningTitle?: string;
  description?: string;
  errorMessage?: string;
  deleteButtonLabel?: string;
  submitButtonLabel?: string;
  warningDescription?: string;
};

export const FilesUpload = ({
  name,
  title,
  formId,
  fileName,
  fileSize,
  description,
  errorMessage,
  warningTitle,
  deleteButtonLabel,
  submitButtonLabel,
  warningDescription,
}: FilesUploadProps) => {
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />
      {!jsAvailable ? (
        <FileInputsNoJS name={name} submitButtonLabel={submitButtonLabel} />
      ) : (
        <FileInput name={name} formId={formId} />
      )}
      <FileUploadInfo
        fileName={fileName}
        fileSize={fileSize}
        deleteButtonLabel={deleteButtonLabel}
      />
      <FileUploadError errorMessage={errorMessage} />
      <FileUploadWarning
        warningTitle={warningTitle}
        warningDescription={warningDescription}
      />
    </div>
  );
};

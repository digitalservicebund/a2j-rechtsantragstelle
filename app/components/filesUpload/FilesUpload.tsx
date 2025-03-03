import { useState, useEffect } from "react";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { FileUploadInfo } from "./FileUploadInfo";
import { InlineNotice, InlineNoticeProps } from "../InlineNotice";
import { FileInput } from "../inputs/FileInput";

export type FilesUploadProps = {
  name: string;
  title?: string;
  formId?: string;
  fileName?: string;
  fileSize?: number;
  description?: string;
  deleteButtonLabel?: string;
  inlineNotices?: InlineNoticeProps[];
};

const maxNumberOfFiles = 5;
const FilesUpload = ({
  name,
  title,
  formId,
  fileName,
  fileSize,
  description,
  inlineNotices,
  deleteButtonLabel,
}: FilesUploadProps) => {
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  if (jsAvailable) {
    return (
      <div className="w-full flex flex-col bg-white p-16">
        <FilesUploadHeader title={title} description={description} />
        <FileInput
          name={name}
          formId={formId}
          selectFilesButtonLabel="Datei Auswählen"
        />
        <FileUploadInfo
          fileName={fileName}
          fileSize={fileSize}
          deleteButtonLabel={deleteButtonLabel}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />
      <div className="w-full flex flex-col">
        {Array.from({ length: maxNumberOfFiles }).map((_, index) => (
          <FileInput
            key={index}
            name={`${name}[${index}]`}
            selectFilesButtonLabel="Datei Auswählen"
          />
        ))}
      </div>
      {inlineNotices?.map((inlineNotice) => (
        <InlineNotice key={inlineNotice.title} {...inlineNotice} />
      ))}
    </div>
  );
};

export default FilesUpload;

import { useState, useEffect } from "react";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { InlineNotice, InlineNoticeProps } from "../InlineNotice";
import { FileInput } from "../inputs/FileInput";

export type FilesUploadProps = {
  name: string;
  title?: string;
  formId?: string;
  description?: string;
  inlineNotices?: InlineNoticeProps[];
};

const maxNumberOfFiles = 5;
const FilesUpload = ({
  name,
  title,
  formId,
  description,
  inlineNotices,
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
        {inlineNotices?.map((inlineNotice) => (
          <InlineNotice key={inlineNotice.title} {...inlineNotice} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={title} description={description} />
      <div className="w-full flex flex-col gap-32">
        {Array.from({ length: maxNumberOfFiles }).map((_, index) => (
          <FileInput
            // eslint-disable-next-line react/no-array-index-key
            key={`${name}[${index}]`}
            name={`${name}[${index}]`}
            selectFilesButtonLabel="Datei Auswählen"
          />
        ))}
      </div>
    </div>
  );
};

export default FilesUpload;

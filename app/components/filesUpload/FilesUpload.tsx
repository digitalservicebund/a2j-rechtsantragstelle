import classNames from "classnames";
import { useState, useEffect } from "react";
import { useField } from "remix-validated-form";
import { ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import { fileUploadLimit } from "~/util/file/pdfFileSchema";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { InlineNotice, InlineNoticeProps } from "../InlineNotice";
import { FileInput } from "../inputs/FileInput";

export type FilesUploadProps = {
  name: string;
  title?: string;
  formId?: string;
  description?: string;
  inlineNotices?: InlineNoticeProps[];
  errorMessages?: ErrorMessageProps[];
};

const FilesUpload = ({
  name,
  title,
  formId,
  description,
  inlineNotices,
  errorMessages,
}: FilesUploadProps) => {
  const [jsAvailable, setJsAvailable] = useState(false);
  const { error } = useField(name);
  const errorId = `${name}-error`;
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

  const classes = classNames("w-full bg-white p-16", {
    "bg-red-200 border border-red-900": !!error,
  });

  return (
    <noscript>
      <div className={classes}>
        <FilesUploadHeader title={title} description={description} />
        <div className="w-full flex flex-col gap-32">
          {Array.from({ length: fileUploadLimit }).map((_, index) => (
            <FileInput
              // eslint-disable-next-line react/no-array-index-key
              key={`${name}[${index}]`}
              name={`${name}[${index}]`}
              selectFilesButtonLabel="Datei Auswählen"
            />
          ))}
        </div>
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </noscript>
  );
};

export default FilesUpload;

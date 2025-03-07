import classNames from "classnames";
import { useState, useEffect } from "react";
import { useFieldArray } from "remix-validated-form";
import { ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import { fileUploadLimit } from "~/util/file/pdfFileSchema";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { InlineNotice, InlineNoticeProps } from "../InlineNotice";
import { FileInput } from "../inputs/FileInput";

export type FilesUploadProps = {
  name: string;
  title?: string;
  description?: string;
  inlineNotices?: InlineNoticeProps[];
  errorMessages?: ErrorMessageProps[];
};

const FilesUpload = ({
  name,
  title,
  description,
  inlineNotices,
  errorMessages,
}: FilesUploadProps) => {
  const [jsAvailable, setJsAvailable] = useState(false);
  const [items, , error] = useFieldArray(name);
  const errorId = `${name}-error`;
  useEffect(() => setJsAvailable(true), []);

  const classes = classNames("w-full bg-white p-16", {
    "bg-red-200 border border-red-900": !!error,
  });

  return (
    <NoscriptWrapper jsAvailable={jsAvailable}>
      <div className={classes}>
        <FilesUploadHeader title={title} description={description} />
        <div className="w-full flex flex-col gap-24">
          {items.map((item, index) => (
            <FileInput
              key={item.key}
              jsAvailable={jsAvailable}
              name={`${name}[${index}]`}
              selectFilesButtonLabel="Datei Auswählen"
            />
          ))}
          {(items.length < fileUploadLimit || items.length === 0) && (
            <FileInput
              jsAvailable={jsAvailable}
              name={`${name}[${items.length}]`}
              selectFilesButtonLabel={
                items.length === 0
                  ? "Datei Auswählen"
                  : "Weitere Datei Auswählen"
              }
            />
          )}
        </div>
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
      {inlineNotices?.map((inlineNotice) => (
        <InlineNotice key={inlineNotice.title} {...inlineNotice} />
      ))}
    </NoscriptWrapper>
  );
};

const NoscriptWrapper = ({
  jsAvailable,
  children,
}: {
  jsAvailable: boolean;
  children: React.ReactNode;
}) => (jsAvailable ? <div>{children}</div> : <noscript>{children}</noscript>);

export default FilesUpload;

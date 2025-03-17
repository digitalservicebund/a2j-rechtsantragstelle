import { useActionData } from "@remix-run/react";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { useField, ValidationErrorResponseData } from "remix-validated-form";
import { ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import { Context } from "~/domains/contexts";
import { fileUploadLimit, PDFFileMetadata } from "~/util/file/pdfFileSchema";
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
  const response = useActionData<
    ValidationErrorResponseData | Context | undefined
  >();
  const { defaultValue } = useField(name, { formId });
  const items: Array<PDFFileMetadata | undefined> =
    (response?.repopulateFields as Context | undefined)?.[name] ??
    (response as Context | undefined)?.[name] ??
    defaultValue ??
    [];
  const scopedErrors = Object.fromEntries(
    Object.entries(response?.fieldErrors ?? {}).filter(
      ([key]) => key.split("[")[0] === name,
    ),
  );
  const errorId = `${name}-error`;

  useEffect(() => setJsAvailable(true), []);

  const groupError: string | undefined = scopedErrors[name];

  const classes = classNames("w-full bg-white p-16", {
    "bg-red-200 border border-red-900": !!groupError,
  });

  const showAddMoreButton =
    (items.length < fileUploadLimit || items.length === 0) &&
    Object.entries(scopedErrors).length === 0;

  return (
    <NoscriptWrapper jsAvailable={jsAvailable}>
      <div className={classes}>
        <FilesUploadHeader title={title} description={description} />
        <div className="w-full flex flex-col gap-24">
          {items.map((value, index) => {
            const inputName = `${name}[${index}]`;
            return (
              <FileInput
                key={inputName}
                selectedFile={value}
                error={scopedErrors[inputName]}
                jsAvailable={jsAvailable}
                name={inputName}
              />
            );
          })}
          {showAddMoreButton && (
            <FileInput
              selectedFile={undefined}
              jsAvailable={jsAvailable}
              name={`${name}[${items.length}]`}
            />
          )}
        </div>
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === groupError)?.text ??
          groupError}
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

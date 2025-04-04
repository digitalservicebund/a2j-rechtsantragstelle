import { useActionData } from "@remix-run/react";
import classNames from "classnames";
import { useState, useEffect } from "react";
import {
  useField,
  type ValidationErrorResponseData,
} from "remix-validated-form";
import { type ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import { type Context } from "~/domains/contexts";
import {
  fileUploadLimit,
  type PDFFileMetadata,
} from "~/util/file/pdfFileSchema";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { InlineNotice, type InlineNoticeProps } from "../InlineNotice";
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
  const { defaultValue, error } = useField(name, { formId });
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

  const classes = classNames("w-full bg-white p-16", {
    "bg-red-200 border border-red-900": !!error,
  });

  const showAddMoreButton =
    items.length === 0 ||
    (items.length < fileUploadLimit &&
      Object.entries(scopedErrors).length === 0);

  /**
   * if the component doesn't have a value, or has an error displayed, normally nothing is submitted in the FormData.
   * We need to send at least an empty array, to display an array-level error that it's empty
   */
  const shouldSubmitEmptyArray =
    // TODO: remove !jsAvailable when e2e test is written
    !jsAvailable &&
    (items.length === 0 ||
      (items.length === 1 && Object.entries(scopedErrors).length > 0));

  return (
    title !== "" && (
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
                  errorMessages={errorMessages}
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
        {shouldSubmitEmptyArray && (
          <input type="hidden" name={"arrayPostfix"} value={name} />
        )}
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
        {inlineNotices?.map((inlineNotice) => (
          <InlineNotice key={inlineNotice.title} {...inlineNotice} />
        ))}
      </NoscriptWrapper>
    )
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

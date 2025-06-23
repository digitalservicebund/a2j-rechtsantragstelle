import { useField, type ValidationErrorResponseData } from "@rvf/react-router";
import classNames from "classnames";
import { useActionData } from "react-router";
import { type ErrorMessageProps } from "~/components/inputs";
import InputError from "~/components/inputs/InputError";
import { type UserData } from "~/domains/userData";
import {
  errorStyling,
  fileUploadLimit,
  type PDFFileMetadata,
} from "~/util/file/pdfFileSchema";
import { FilesUploadHeader } from "./FilesUploadHeader";
import { useJsAvailable } from "../hooks/useJsAvailable";
import { InlineNotice, type InlineNoticeProps } from "../InlineNotice";
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
  const jsAvailable = useJsAvailable();
  const response = useActionData<
    ValidationErrorResponseData | UserData | undefined
  >();
  const field = useField(name);
  const items: Array<PDFFileMetadata | undefined> = ((
    response?.repopulateFields as UserData | undefined
  )?.[name] ??
    (response as UserData | undefined)?.[name] ??
    field.defaultValue() ??
    []) as Array<PDFFileMetadata | undefined>;
  const scopedErrors = Object.fromEntries(
    Object.entries(response?.fieldErrors ?? {}).filter(
      ([key]) => key.split("[")[0] === name,
    ),
  );
  const errorId = `${name}-error`;
  const classes = classNames("w-full bg-white p-16 flex flex-col gap-16", {
    [errorStyling]: !!field.error(),
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
    items.length === 0 ||
    (items.length === 1 && Object.entries(scopedErrors).length > 0);

  return (
    title !== "" && (
      <NoscriptWrapper jsAvailable={jsAvailable}>
        <div data-testid={`files-upload-${name}`} className={classes}>
          <FilesUploadHeader title={title} description={description} />
          <div className="w-full flex flex-col gap-16">
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
          {items.length === fileUploadLimit &&
            inlineNotices?.map((inlineNotice) => (
              <InlineNotice key={inlineNotice.title} {...inlineNotice} />
            ))}
        </div>
        {shouldSubmitEmptyArray && (
          <input type="hidden" name={"arrayPostfix"} value={name} />
        )}
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === field.error())?.text ??
            field.error()}
        </InputError>
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

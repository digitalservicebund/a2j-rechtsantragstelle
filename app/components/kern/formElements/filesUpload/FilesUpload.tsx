import { useField, type ValidationErrorResponseData } from "@rvf/react-router";
import classNames from "classnames";
import { useActionData } from "react-router";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../InputError";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type UserData } from "~/domains/userData";
import {
  fileUploadLimit,
  type PDFFileMetadata,
} from "~/services/validation/pdfFileSchema";
import { KernFileInput } from "./FileInput";
import { FilesUploadHeader } from "./FilesUploadHeader";
import {
  KernInlineNotice,
  type KernInlineNoticeProps,
} from "../../KernInlineNotice";

export type FilesUploadProps = {
  name: string;
  title?: string;
  description?: string;
  inlineNotices?: KernInlineNoticeProps[];
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
  if (title === "") return null;
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
  const classes = classNames({
    "kern-form-input--error": !!field.error(),
  });

  const hasFileRequiredError =
    Object.keys(scopedErrors).length === 1 &&
    Object.entries(scopedErrors).some(
      ([key]) =>
        key.split("[")[0] === name && scopedErrors[key] === "fileRequired",
    );
  const showAddMoreButton =
    items.length === 0 ||
    (items.length < fileUploadLimit &&
      Object.entries(scopedErrors).length === 0) ||
    hasFileRequiredError;

  /**
   * if the component doesn't have a value, or has an error displayed, normally nothing is submitted in the FormData.
   * We need to send at least an empty array, to display an array-level error that it's empty
   */
  const shouldSubmitEmptyArray =
    items.length === 0 ||
    (items.length === 1 && Object.entries(scopedErrors).length > 0);

  return (
    <NoscriptWrapper jsAvailable={jsAvailable}>
      <div className={classes}>
        <div
          data-testid={`files-upload-${name}`}
          className={classNames(
            "p-kern-space-default flex flex-col gap-kern-space-default bg-white",
            {
              "bg-kern-feedback-danger-background! border border-2 border-kern-feedback-danger rounded-sm mb-kern-space-default":
                !!field.error(),
            },
          )}
        >
          <FilesUploadHeader title={title} description={description} />
          <div className="flex flex-col gap-kern-space-small">
            {items.map((value, index) => {
              const inputName = `${name}[${index}]`;
              return (
                <KernFileInput
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
              <KernFileInput
                selectedFile={undefined}
                jsAvailable={jsAvailable}
                name={`${name}[${items.length}]`}
                error={scopedErrors[`${name}[${items.length}]`]}
                errorMessages={errorMessages}
              />
            )}
          </div>
          {items.length === fileUploadLimit &&
            inlineNotices?.map((inlineNotice) => (
              <KernInlineNotice key={inlineNotice.title} {...inlineNotice} />
            ))}
        </div>
        {shouldSubmitEmptyArray && (
          <input type="hidden" name={"arrayPostfix"} value={name} />
        )}
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === field.error())?.text ??
            field.error()}
        </InputError>
      </div>
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

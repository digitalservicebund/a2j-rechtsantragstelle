import classNames from "classnames";
import { useRef } from "react";
import Button from "~/components/common/Button";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "~/components/formElements/InputError";
import { translations } from "~/services/translations/translations";
import { splitFieldName } from "~/services/upload/splitFieldName";
import { type PDFFileMetadata } from "~/services/validation/pdfFileSchema";
import { FileUploadInfo } from "./FileUploadInfo";
import { useFileHandler } from "./useFileHandler";

type FileInputProps = {
  name: string;
  selectedFile: PDFFileMetadata | undefined;
  jsAvailable: boolean;
  error?: string;
  helperText?: string;
  errorMessages?: ErrorMessageProps[];
};

export const FileInput = ({
  name,
  jsAvailable,
  selectedFile,
  error,
  helperText,
  errorMessages,
}: FileInputProps) => {
  const { onFileDelete, onFileUpload } = useFileHandler();
  const errorId = `${name}-error`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FileInput = (
    <input
      name={jsAvailable ? undefined : name}
      type="file"
      accept=".pdf"
      data-testid={`file-upload-input-${name}`}
      aria-invalid={error !== undefined}
      aria-errormessage={error && errorId}
      className={classNames(
        jsAvailable
          ? "w-0 h-0 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          : "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary file:ds-button-large w-fit file:cursor-pointer",
      )}
      ref={fileInputRef}
      onBlur={(event) => {
        // Reset the input element once its not relevant anymore (either after upload or deletion), otherwise the stale file reference might interfere with future interactions
        event.target.files = null;
        event.currentTarget.value = "";
      }}
      onChange={(event) => onFileUpload(name, event.target.files?.[0])}
    />
  );

  return (
    <>
      {selectedFile ? (
        <FileUploadInfo
          inputName={name}
          onFileDelete={onFileDelete}
          jsAvailable={jsAvailable}
          file={selectedFile}
          hasError={!!error}
        />
      ) : (
        <>
          {jsAvailable ? (
            <label className="relative inline-flex items-center ds-button ds-button-tertiary ds-button-large cursor-pointer w-fit">
              {FileInput}
              <span className="ds-button-label">
                {splitFieldName(name).inputIndex === 0
                  ? translations.fileUpload.select.de
                  : translations.fileUpload.addAnother.de}
              </span>
            </label>
          ) : (
            <div className="flex flex-row">
              <label>
                {FileInput}
                <Button
                  name="_action"
                  value={`fileUpload.${name}`}
                  className="w-fit"
                  type="submit"
                  look="primary"
                  text={translations.fileUpload.upload.de}
                  size="large"
                />
              </label>
            </div>
          )}
        </>
      )}
      {error && (
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      )}
      {helperText && <div className="label-text mt-6">{helperText}</div>}
    </>
  );
};

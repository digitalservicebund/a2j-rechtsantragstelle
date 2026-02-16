import classNames from "classnames";
import React, { useRef } from "react";
import { type ErrorMessageProps } from "~/components/common/types";
import KernButton from "~/components/kern/KernButton";
import InputError from "../InputError";
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

export const KernFileInput = ({
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
      id={name}
      name={jsAvailable ? undefined : name}
      type="file"
      accept=".pdf"
      data-testid={`file-upload-input-${name}`}
      aria-invalid={error !== undefined}
      aria-errormessage={error && errorId}
      className={classNames(
        error && "kern-form-input__input--error",
        jsAvailable
          ? "w-0 h-0 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          : "kern-body m-8 ml-0 file:kern-btn file:kern-btn--tertiary file:kern-btn--large w-fit file:cursor-pointer",
      )}
      ref={fileInputRef}
      onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
        // Reset the input element once its not relevant anymore (either after upload or deletion), otherwise the stale file reference might interfere with future interactions
        event.target.files = null;
        event.currentTarget.value = "";
      }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onFileUpload(name, event.target.files?.[0])
      }
    />
  );

  return (
    <div
      className={classNames(
        error && "kern-form-input--error",
      )}
    >
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
            <>
              <KernButton
                type="button"
                look="secondary"
                onClick={() => fileInputRef.current?.click()}
                text={
                  splitFieldName(name).inputIndex === 0
                    ? translations.fileUpload.select.de
                    : translations.fileUpload.addAnother.de
                }
              />
              {FileInput}
            </>
          ) : (
            <>
              <label className="kern-label" htmlFor={name}>
                {splitFieldName(name).inputIndex === 0
                  ? translations.fileUpload.select.de
                  : translations.fileUpload.addAnother.de}
              </label>
              {FileInput}
              <KernButton
                name="_action"
                value={`fileUpload.${name}`}
                type="submit"
                look="primary"
                text={translations.fileUpload.upload.de}
              />
            </>
          )}
        </>
      )}
      {error && (
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      )}
      {helperText && <div className="kern-hint mt-6">{helperText}</div>}
    </div>
  );
};

import classNames from "classnames";
import Button from "~/components/Button";
import { FileUploadInfo } from "~/components/filesUpload/FileUploadInfo";
import InputError from "~/components/inputs/InputError";
import { useTranslations } from "~/services/translations/translationsContext";
import { splitFieldName } from "~/services/upload/splitFieldName";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";
import { type ErrorMessageProps } from ".";
import { useFileHandler } from "../filesUpload/useFileHandler";

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
  const { fileUpload: translations } = useTranslations();
  const errorId = `${name}-error`;

  const inputClasses = classNames(
    "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary file:ds-button-large w-full",
    {
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer":
        jsAvailable,
    },
  );

  const FileInput = (
    <input
      name={jsAvailable ? undefined : name}
      onChange={(event) => {
        const file = event.target.files?.[0];
        void onFileUpload(name, file);
      }}
      type="file"
      accept=".pdf"
      data-testid="fileUploadInput"
      aria-invalid={error !== undefined}
      aria-errormessage={error && errorId}
      className={inputClasses}
    />
  );

  return (
    <div className="flex-col">
      {selectedFile ? (
        <FileUploadInfo
          inputName={name}
          onFileDelete={(fileName) => {
            void onFileDelete(fileName);
          }}
          jsAvailable={jsAvailable}
          file={selectedFile}
          deleteButtonLabel={translations?.delete}
          hasError={!!error}
        />
      ) : (
        <label htmlFor={name} className={"flex flex-col md:flex-row"}>
          {jsAvailable ? (
            <div className="ds-button ds-button-tertiary ds-button-large">
              <span className="ds-button-label">
                {splitFieldName(name).inputIndex === 0
                  ? translations?.select
                  : translations?.addAnother}
              </span>
              {FileInput}
            </div>
          ) : (
            <>
              {FileInput}
              <Button
                name="_action"
                value={`fileUpload.${name}`}
                className="w-fit"
                type="submit"
                look="primary"
                text={translations?.upload}
                size="large"
              />
            </>
          )}
        </label>
      )}
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
      <div className="label-text mt-6">{helperText}</div>
    </div>
  );
};

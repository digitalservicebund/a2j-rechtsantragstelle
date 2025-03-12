import classNames from "classnames";
import Button from "~/components/Button";
import { useFileHandler } from "~/components/filesUpload/fileUploadHelpers";
import { FileUploadInfo } from "~/components/filesUpload/FileUploadInfo";
import InputError from "~/components/inputs/InputError";
import { useTranslations } from "~/services/translations/translationsContext";
import { PDFFileMetadata } from "~/util/file/pdfFileSchema";
import { ErrorMessageProps } from ".";

export type FileInputProps = {
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

  const classes = classNames(
    "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary w-full",
    {
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer":
        jsAvailable,
    },
  );
  const inputIndex = Number(name.at(-2));

  return (
    <div className="flex-col">
      {selectedFile ? (
        <FileUploadInfo
          inputName={name}
          onFileDelete={onFileDelete}
          jsAvailable={jsAvailable}
          fileName={selectedFile.filename}
          fileSize={selectedFile.fileSize}
          deleteButtonLabel={translations?.delete}
          hasError={!!error}
        />
      ) : (
        <label htmlFor={name} className={"flex flex-col md:flex-row"}>
          <input
            name={name}
            onChange={(event) => onFileUpload(name, event.target.files?.[0])}
            type="file"
            accept=".pdf, .tiff, .tif"
            data-testid="fileUploadInput"
            aria-invalid={error !== undefined}
            aria-errormessage={error && errorId}
            className={classes}
          />
          {jsAvailable ? (
            <Button
              look="tertiary"
              text={
                inputIndex === 0
                  ? translations?.select
                  : translations?.addAnother
              }
            />
          ) : (
            <Button
              name="_action"
              value={`fileUpload.${name}`}
              className="w-fit"
              type="submit"
              look="primary"
              text={translations?.upload}
              size="large"
            />
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

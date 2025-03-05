import classNames from "classnames";
import { useField } from "remix-validated-form";
import { FileUploadInfo } from "~/components/filesUpload/FileUploadInfo";
import InputError from "~/components/inputs/InputError";
import { PDFFileMetadata } from "~/util/file/pdfFileSchema";
import { ErrorMessageProps } from ".";
import Button from "../Button";

export type FileInputProps = {
  name: string;
  jsAvailable: boolean;
  helperText?: string;
  selectFilesButtonLabel?: string;
  errorMessages?: ErrorMessageProps[];
};

export const FileInput = ({
  name,
  jsAvailable,
  helperText,
  errorMessages,
  selectFilesButtonLabel,
}: FileInputProps) => {
  const { error, getInputProps } = useField(name);
  const errorId = `${name}-error`;
  const { defaultValue } = getInputProps();
  const fileMetadata = defaultValue as PDFFileMetadata | undefined;

  const classes = classNames(
    "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary w-full",
    {
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer":
        jsAvailable,
    },
  );
  return (
    <div className="flex-col">
      <label htmlFor={name} className={"flex flex-col md:flex-row"}>
        <input
          name={name}
          type="file"
          accept=".pdf, .tiff, .tif"
          data-testid="fileUploadInput"
          aria-invalid={error !== undefined}
          aria-errormessage={error && errorId}
          className={classes}
        />
        {jsAvailable ? (
          <Button look="tertiary" text={selectFilesButtonLabel} />
        ) : (
          <Button
            name="_action"
            value={`fileUpload.${name}`}
            className="w-fit"
            type="submit"
            look="primary"
            text="Hochladen"
            size="large"
          />
        )}
      </label>
      {fileMetadata && (
        <FileUploadInfo
          fileName={fileMetadata.filename}
          fileSize={fileMetadata.fileSize}
          deleteButtonLabel={"Löschen"}
          hasError={!!error}
        />
      )}
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
      <div className="label-text mt-6">{helperText}</div>
    </div>
  );
};

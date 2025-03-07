import { useLoaderData, useSubmit } from "@remix-run/react";
import classNames from "classnames";
import { useField } from "remix-validated-form";
import Button from "~/components/Button";
import { FileUploadInfo } from "~/components/filesUpload/FileUploadInfo";
import InputError from "~/components/inputs/InputError";
import { loader } from "~/routes/shared/formular.server";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { PDFFileMetadata } from "~/util/file/pdfFileSchema";
import { ErrorMessageProps } from ".";

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
  const { error, defaultValue: selectedFile } = useField(name);
  const { onFileUpload } = useFileUploadHandler();
  const errorId = `${name}-error`;

  const classes = classNames(
    "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary w-full",
    {
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer":
        jsAvailable,
    },
  );

  return (
    <div className="flex-col">
      {selectedFile ? (
        <FileUploadInfo
          fileName={selectedFile.filename}
          fileSize={selectedFile.fileSize}
          deleteButtonLabel={"Löschen"}
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
      )}
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
      <div className="label-text mt-6">{helperText}</div>
    </div>
  );
};

export function convertFileToMetadata(file?: File): PDFFileMetadata {
  return {
    filename: file?.name ?? "",
    fileType: file?.type ?? "",
    fileSize: file?.size ?? 0,
    createdOn: file?.lastModified
      ? new Date(file?.lastModified).toString()
      : "",
  };
}

export function useFileUploadHandler() {
  const { csrf } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  return {
    onFileUpload: (fieldName: string, file: File | undefined) => {
      const formData = new FormData();
      formData.append("_action", `fileUpload.${fieldName}`);
      formData.append(CSRFKey, csrf);
      formData.append(fieldName, file ?? "");
      submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    },
  };
}

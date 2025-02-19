import { useEffect, useState } from "react";
import { useField } from "remix-validated-form";
import { ErrorMessageProps } from ".";
import Button from "../Button";
import InputError from "./InputError";
import { FilesUploadNoJS } from "../filesUpload/FilesUploadNoJS";

export type FileInputProps = {
  name: string;
  formId?: string;
  helperText?: string;
  errorMessages?: ErrorMessageProps[];
};

export const FileInput = ({
  name,
  formId,
  helperText,
  errorMessages,
}: FileInputProps) => {
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  if (!jsAvailable) {
    <FilesUploadNoJS name={"Upload Files"} buttonText={"Select Files"} />;
  }

  return (
    <>
      <div className="ds-input-group">
        <label htmlFor={name}>
          <input
            {...getInputProps({ id: name })}
            multiple
            type="file"
            accept=".pdf, .tiff, .tif"
            data-testid="fileUploadInput"
            aria-invalid={error !== undefined}
            aria-errormessage={error && errorId}
            className="ds-input w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          />
          {/* change button label here according to files or !files */}
          <Button look="tertiary" text={"Select files"} />
        </label>
        <div className="label-text mt-6" id={helperId}>
          {helperText}
        </div>
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      </div>
    </>
  );
};

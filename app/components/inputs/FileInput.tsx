import { useField } from "remix-validated-form";
import { ErrorMessageProps } from ".";
import Button from "../Button";
import InputError from "./InputError";

export type FileInputProps = {
  name: string;
  label?: string;
  formId?: string;
  helperText?: string;
  selectFilesButtonLabel?: string;
  errorMessages?: ErrorMessageProps[];
};

export const FileInput = ({
  name,
  formId,
  helperText,
  errorMessages,
  selectFilesButtonLabel,
}: FileInputProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div>
      <label htmlFor={name}>
        <input
          {...getInputProps({ id: name })}
          multiple
          type="file"
          accept=".pdf, .tiff, .tif"
          data-testid="fileUploadInput"
          aria-invalid={error !== undefined}
          aria-errormessage={error && errorId}
          className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
        />
        <Button look="tertiary" text={selectFilesButtonLabel} />
      </label>
      <div className="label-text mt-6" id={helperId}>
        {helperText}
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

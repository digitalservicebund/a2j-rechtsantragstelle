import classNames from "classnames";
import { useField } from "remix-validated-form";
import InputError from "~/components/inputs/InputError";
import { ErrorMessageProps } from ".";
import Button from "../Button";

export type FileInputProps = {
  name: string;
  label?: string;
  formId?: string;
  helperText?: string;
  selectFilesButtonLabel?: string;
  errorMessages?: ErrorMessageProps[];
  jsEnabled?: boolean;
};

export const FileInput = ({
  name,
  formId,
  helperText,
  errorMessages,
  selectFilesButtonLabel,
  jsEnabled = false,
}: FileInputProps) => {
  const { error } = useField(name, { formId });
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  const classes = classNames("overflow-hidden absolute z-0 cursor-pointer", {
    "w-0.1 h-0.1": jsEnabled,
    "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary": !jsEnabled,
  });
  return (
    <div>
      <label htmlFor={name}>
        <input
          name={name}
          type="file"
          accept=".pdf, .tiff, .tif"
          data-testid="fileUploadInput"
          aria-invalid={error !== undefined}
          aria-errormessage={error && errorId}
          className={classes}
        />
        {jsEnabled && <Button look="tertiary" text={selectFilesButtonLabel} />}
        {!jsEnabled && (
          <Button
            name="_action"
            value={`fileUpload.${name}`}
            type="submit"
            look="primary"
            text="hochladen"
            size="large"
          />
        )}
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

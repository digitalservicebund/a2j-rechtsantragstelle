import classNames from "classnames";
import { useEffect, useState } from "react";
import { useField } from "remix-validated-form";
import InputError from "~/components/inputs/InputError";
import { ErrorMessageProps } from ".";
import Button from "../Button";

export type FileInputProps = {
  name: string;
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
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  const { error } = useField(name, { formId });
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  const classes = classNames(
    "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary",
    {
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer":
        jsAvailable,
    },
  );
  return (
    <div>
      <label
        htmlFor={name}
        className={classNames({ "flex justify-between": !jsAvailable })}
      >
        <input
          name={name}
          type="file"
          accept=".pdf, .tiff, .tif"
          data-testid="fileUploadInput"
          aria-invalid={error !== undefined}
          aria-errormessage={error && errorId}
          className={classes}
        />
        {jsAvailable && (
          <Button look="tertiary" text={selectFilesButtonLabel} />
        )}
        {!jsAvailable && (
          <Button
            name="_action"
            value={`fileUpload.${name}`}
            type="submit"
            look="primary"
            text="Hochladen"
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

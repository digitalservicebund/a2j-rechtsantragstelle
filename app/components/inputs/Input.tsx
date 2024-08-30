import classNames from "classnames";
import type React from "react";
import { useField } from "remix-validated-form";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from ".";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { widthClassname, type FieldWidth } from "./width";

export type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  step?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  errorMessages?: ErrorMessageProps[];
  helperText?: string;
  width?: FieldWidth;
  formId?: string;
}>;

const Input = function InputComponent({
  name,
  label,
  type = "text",
  step,
  placeholder,
  prefix,
  suffix,
  errorMessages,
  helperText,
  width,
  formId,
  innerRef,
}: InputProps & { innerRef?: React.Ref<HTMLInputElement> }) {
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <div className="ds-input-group">
        {prefix && <div className="ds-input-prefix">{prefix}</div>}
        <input
          maxLength={INPUT_CHAR_LIMIT}
          {...getInputProps({
            type: type === "number" ? "text" : type,
            step,
            id: name,
            inputMode: type === "number" ? "decimal" : undefined,
            placeholder,
          })}
          ref={innerRef}
          className={classNames(
            "ds-input forced-color-adjust-none",
            {
              "has-error": error,
              "ds-input-select-width-54-36": width === "36" || width === "54",
            },
            widthClassname(width),
          )}
          aria-invalid={error !== undefined}
          aria-describedby={[error && errorId, helperText && helperId].join(
            " ",
          )}
          aria-errormessage={error && errorId}
        />
        {suffix && (
          <div className="ds-input-suffix" aria-hidden="true">
            {suffix}
          </div>
        )}
      </div>
      <div className="label-text mt-6" id={helperId}>
        {helperText}
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Input;

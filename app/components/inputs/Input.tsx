import { useField } from "@rvf/react-router";
import classNames from "classnames";
import type React from "react";
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
  width?: FieldWidth;
  formId?: string;
  helperText?: string;
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
  innerRef,
}: InputProps & { innerRef?: React.Ref<HTMLInputElement> }) {
  const field = useField(name);
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <div className="ds-input-group">
        {prefix && <div className="ds-input-prefix">{prefix}</div>}
        <input
          maxLength={INPUT_CHAR_LIMIT}
          {...field.getInputProps({
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
              "has-error": field.error(),
            },
            widthClassname(width),
          )}
          aria-invalid={field.error() !== undefined}
          aria-describedby={[
            field.error() && errorId,
            helperText && helperId,
          ].join(" ")}
          aria-errormessage={field.error() ? errorId : undefined}
          aria-required={
            !!errorMessages?.find((err) => err.code === "required")
          }
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
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default Input;

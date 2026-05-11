import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from "~/components/common/types";
import { type InputHTMLAttributes } from "react";
import InputError from "../error/InputError";

export type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  step?: string | number;
  prefix?: string;
  suffix?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  readonly?: boolean;
  charLimit?: number;
  helperText?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  ariaDescribedBy?: InputHTMLAttributes<HTMLInputElement>["aria-describedby"];
}>;

const TextInput = function InputComponent({
  name,
  label,
  suffix,
  inputRef,
  readonly,
  helperText,
  placeholder,
  errorMessages,
  ariaDescribedBy,
  charLimit = INPUT_CHAR_LIMIT,
}: InputProps) {
  const field = useField(name);
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  return (
    <div
      className={classNames("kern-form-input", {
        "kern-form-input--error": field.error(),
      })}
    >
      {label && (
        <label className="kern-label" htmlFor={name}>
          {label}
          {suffix && <span className="kern-label__optional">{suffix}</span>}
        </label>
      )}
      {helperText && (
        <div className="kern-body text-kern-layout-text-muted!" id={helperId}>
          {helperText}
        </div>
      )}
      <input
        className={classNames("kern-form-input__input bg-white!", {
          "kern-form-input__input--error": field.error(),
        })}
        {...field.getInputProps({
          id: name,
        })}
        name={name}
        type="text"
        placeholder={placeholder}
        maxLength={charLimit}
        readOnly={readonly}
        aria-invalid={field.error() !== null}
        aria-describedby={[
          field.error() && errorId,
          helperText && helperId,
          ariaDescribedBy,
        ].join(" ")}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
        ref={inputRef}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default TextInput;

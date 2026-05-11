import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";

type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  step?: string | number;
  prefix?: string;
  suffix?: string;
  readonly?: boolean;
  charLimit?: number;
  helperText?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const NumberInput = function InputComponent({
  step,
  name,
  label,
  suffix,
  readonly,
  helperText,
  placeholder,
  errorMessages,
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
          step,
          id: name,
          inputMode: "decimal",
          placeholder,
        })}
        name={name}
        aria-invalid={field.error() !== null}
        aria-describedby={[
          field.error() && errorId,
          helperText && helperId,
        ].join(" ")}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
        readOnly={readonly}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default NumberInput;

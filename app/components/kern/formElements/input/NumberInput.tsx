import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import { widthClassname, type FieldWidth } from "~/components/common/width";
import InputError from "../InputError";

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
  helperText?: string;
  charLimit?: number;
}>;

const NumberInput = function InputComponent({
  name,
  width,
  label,
  placeholder,
  step,
  errorMessages,
  helperText,
}: InputProps) {
  const field = useField(name);
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div
      className={classNames(
        "kern-form-input",
        {
          "kern-form-input--error": field.error(),
        },
        widthClassname(width),
      )}
    >
      {label && <div className="kern-label">{label}</div>}
      <input
        className={classNames("kern-form-input__input", {
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
      />

      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default NumberInput;

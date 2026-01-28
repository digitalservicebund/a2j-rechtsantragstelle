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

const TelephoneInput = function InputComponent({
  name,
  width,
  label,
  placeholder,
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
        className={classNames("kern-form-input__input bg-white!", {
          "kern-form-input__input--error": field.error(),
        })}
        {...field.getInputProps({
          id: name,
          inputMode: "tel",
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

export default TelephoneInput;

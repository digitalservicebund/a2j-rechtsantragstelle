import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";
import { InputLabel } from "../label/InputLabel";
import { InputHelperText } from "../helperText/InputHelperText";

type InputProps = Readonly<{
  name: string;
  label?: string;
  suffix?: string;
  readonly?: boolean;
  helperText?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const TelephoneInput = function InputComponent({
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
      {label && <InputLabel name={name} label={label} suffix={suffix} />}

      {helperText && (
        <InputHelperText helperText={helperText} helperId={helperId} />
      )}
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
        readOnly={readonly}
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

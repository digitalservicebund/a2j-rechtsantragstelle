import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";

type InputProps = Readonly<{
  name: string;
  // min: number;
  // max?: number;
  label?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const NumberIncrement = function InputComponent({
  name,
  label,
  errorMessages,
}: InputProps) {
  const field = useField(name);
  const errorId = `${name}-error`;

  return (
    <div
      className={classNames("kern-form-input", {
        "kern-form-input--error": field.error(),
      })}
    >
      {label && (
        <label className="kern-label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={classNames("kern-form-input__input bg-white!", {
          "kern-form-input__input--error": field.error(),
        })}
        {...field.getInputProps({
          id: name,
          inputMode: "decimal",
        })}
        name={name}
        type="number"
        aria-invalid={field.error() !== null}
        aria-describedby={[field.error() && errorId].join(" ")}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default NumberIncrement;

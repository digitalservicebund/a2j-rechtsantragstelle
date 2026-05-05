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
  const field = useField<number>(name);
  const errorId = `${name}-error`;

  const increment = () => {
    const value = field.value();
    field.setValue(value + 1);
    field.validate();
  };

  const decrement = () => {
    const value = field.value();
    field.setValue(value - 1);
    field.validate();
  };

  const inputProps = field.getInputProps();
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
        {...inputProps}
        value={field.value()}
        name={name}
        type="number"
        aria-invalid={field.error() !== null}
        aria-describedby={[field.error() && errorId].join(" ")}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      />
      <button type="button" onClick={decrement}>
        Decrease
      </button>
      <button type="button" onClick={increment}>
        Increase
      </button>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default NumberIncrement;

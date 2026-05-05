import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";
import { Icon } from "~/components/common/Icon";
import Button from "~/components/formElements/Button";
import { translations } from "~/services/translations/translations";

type InputProps = Readonly<{
  name: string;
  label?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const IncrementDecrementButton: React.FC<{
  onClick: () => void;
  type: "decrement" | "increment";
  label?: string;
}> = ({ onClick, type, label }) => {
  return (
    <Button
      className="p-10! min-h-min! rounded-none!"
      type="button"
      aria-label={
        type === "decrement"
          ? `${label} ${translations.numberIncrementComponent.decrementButtonLabel.de}`
          : `${label} ${translations.numberIncrementComponent.incrementButtonLabel.de}`
      }
      onClick={onClick}
      iconLeft={
        <Icon
          name={type === "decrement" ? "minus" : "plus"}
          className="fill-white"
          size={20}
        />
      }
    />
  );
};

const NumberIncrement = function InputComponent({
  name,
  label,
  errorMessages,
}: InputProps) {
  const field = useField<number>(name);
  const errorId = `${name}-error`;

  const increment = () => {
    field.setValue((field.value() ?? 0) + 1);
    field.validate();
  };

  const decrement = () => {
    field.setValue((field.value() ?? 0) - 1);
    field.validate();
  };

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
      <div
        className={classNames("p-4 bg-white gap-5 flex", {
          "kern-form-input__input--error": field.error(),
        })}
      >
        <IncrementDecrementButton
          type="decrement"
          onClick={decrement}
          label={label}
        />
        <input
          className={classNames(
            "bg-white max-w-52 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
            {
              "bg-kern-feedback-danger-background!": field.error(),
            },
          )}
          id={name}
          {...field.getInputProps()}
          value={field.value() ?? 0}
          defaultValue={undefined}
          name={name}
          type="number"
          aria-invalid={field.error() !== null}
          aria-describedby={[field.error() && errorId].join(" ")}
          aria-required={
            !!errorMessages?.find((err) => err.code === "required")
          }
        />
        <IncrementDecrementButton
          type="increment"
          onClick={increment}
          label={label}
        />
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default NumberIncrement;

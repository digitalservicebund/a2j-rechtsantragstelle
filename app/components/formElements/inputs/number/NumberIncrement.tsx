import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";
import { Icon } from "~/components/common/Icon";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { NoscriptWrapper } from "~/components/common/NoscriptWrapper";
import { InputLabel } from "../label/InputLabel";

type InputProps = Readonly<{
  name: string;
  min?: number;
  max?: number;
  label?: string;
  errorMessages?: ErrorMessageProps[];
  suffix?: string;
}>;

const IncrementDecrementButton: React.FC<{
  onClick: () => void;
  type: "decrement" | "increment";
  disabled?: boolean;
  label?: string;
}> = ({ onClick, type, disabled, label }) => {
  return (
    <Button
      className="p-10! min-h-min! rounded-none!"
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
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
  min,
  max,
  label,
  errorMessages,
  suffix,
}: InputProps) {
  const field = useField<number>(name);
  const jsAvailable = useJsAvailable();
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
    <NoscriptWrapper jsAvailable={jsAvailable}>
      {jsAvailable ? (
        <div
          className={classNames("kern-form-input", {
            "kern-form-input--error": field.error(),
          })}
        >
          {label && <InputLabel name={name} label={label} suffix={suffix} />}
          <div
            className={classNames("p-4 bg-white gap-5 flex", {
              "kern-form-input__input--error": field.error(),
            })}
          >
            <IncrementDecrementButton
              type="decrement"
              onClick={decrement}
              label={label}
              disabled={field.value() === min || !field.value()}
            />
            <input
              className={classNames(
                "bg-white min-w-50 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
                {
                  "bg-kern-feedback-danger-background!": field.error(),
                },
              )}
              id={name}
              {...field.getInputProps()}
              value={field.value() ?? min ?? 0}
              min={min}
              max={max}
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
              disabled={field.value() >= (max ?? Number.MAX_SAFE_INTEGER)}
              label={label}
            />
          </div>
          <InputError id={errorId}>
            {errorMessages?.find((err) => err.code === field.error())?.text ??
              field.error()}
          </InputError>
        </div>
      ) : (
        <NumberIncrementNoJS
          name={name}
          min={min}
          max={max}
          label={label}
          errorMessages={errorMessages}
        />
      )}
    </NoscriptWrapper>
  );
};

const NumberIncrementNoJS = function InputComponent({
  name,
  min,
  max,
  label,
  errorMessages,
}: InputProps) {
  const field = useField<number>(name);
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
        className={classNames("kern-form-input__input", {
          "kern-form-input__input--error": field.error(),
        })}
        id={name}
        {...field.getInputProps()}
        value={field.value() ?? min ?? 0}
        name={name}
        min={min}
        max={max ?? Number.MAX_SAFE_INTEGER}
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

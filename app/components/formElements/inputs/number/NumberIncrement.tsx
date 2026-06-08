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

type Props = Readonly<{
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
}> = ({ onClick, type, disabled }) => {
  return (
    <Button
      className="p-10! min-h-min! rounded-sm!"
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={
        type === "decrement"
          ? translations.numberIncrementComponent.decrementButtonLabel.de
          : translations.numberIncrementComponent.incrementButtonLabel.de
      }
      look="secondary"
      onClick={onClick}
      iconLeft={
        <Icon
          name={type === "decrement" ? "minus" : "plus"}
          className="fill-kern-action-default!"
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
}: Props) {
  const field = useField<number>(name);
  const jsAvailable = useJsAvailable();
  const errorId = `${name}-error`;
  const inputProps = field.getInputProps() ?? {};
  const hasOnChange = typeof inputProps.onChange === "function";
  const currentNumber = Number(field.value() ?? min ?? 0);

  const increment = () => {
    field.setValue(currentNumber + 1);
    field.validate();
  };

  const decrement = () => {
    field.setValue(currentNumber - 1);
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
          <div className={"p-4 gap-5 flex"}>
            <IncrementDecrementButton
              type="decrement"
              onClick={decrement}
              disabled={currentNumber === min || !currentNumber}
            />
            <input
              className={classNames(
                "kern-form-input__input min-w-50 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
                {
                  "kern-form-input__input--error": field.error(),
                  "bg-white!": !field.error(),
                },
              )}
              id={name}
              {...inputProps}
              value={currentNumber}
              defaultValue={undefined}
              min={min}
              max={max}
              onChange={inputProps.onChange}
              readOnly={!hasOnChange}
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
              disabled={currentNumber >= (max ?? Number.MAX_SAFE_INTEGER)}
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
}: Props) {
  const field = useField<number>(name);
  const errorId = `${name}-error`;
  const inputProps = field.getInputProps() ?? {};
  const hasOnChange = typeof inputProps.onChange === "function";

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
        {...inputProps}
        value={field.value() ?? min ?? 0}
        onChange={inputProps.onChange}
        readOnly={!hasOnChange}
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

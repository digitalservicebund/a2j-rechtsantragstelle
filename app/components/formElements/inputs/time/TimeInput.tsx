import { useField } from "@rvf/react-router";
import { IMaskMixin } from "react-imask";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";

type TimeInputProps = Readonly<{
  name: string;
  label?: string;
  suffix?: string;
  helperText?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
}>;

type MaskedInputProps = TimeInputProps & {
  readonly mask: string | RegExp;
  readonly eager?: boolean | ("remove" | "append");
};

const TimeInputBase = function TimeInputComponent({
  name,
  label,
  suffix,
  inputRef,
  helperText,
  placeholder,
  errorMessages,
}: TimeInputProps & { inputRef?: React.Ref<HTMLInputElement> }) {
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
        {...field.getInputProps({
          id: name,
        })}
        ref={inputRef}
        className={classNames("kern-form-input__input bg-white!", {
          "kern-form-input__input--error": field.error(),
        })}
        name={name}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        aria-invalid={field.error() !== null}
        aria-describedby={[field.error() && errorId, helperText && helperId]
          .filter(Boolean)
          .join(" ")}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

const MaskedTimeInput = IMaskMixin<HTMLInputElement, TimeInputProps>(
  ({ inputRef, ...props }) => <TimeInputBase {...props} inputRef={inputRef} />,
);

const TimeInput = (props: TimeInputProps) => {
  return (
    <MaskedTimeInput
      {...props}
      {...({ mask: "`0`0:`0`0", eager: "append" } as MaskedInputProps)}
    />
  );
};

export default TimeInput;

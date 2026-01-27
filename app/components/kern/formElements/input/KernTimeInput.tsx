import { useField } from "@rvf/react-router";
import { IMaskMixin } from "react-imask";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import { widthClassname, type FieldWidth } from "~/components/common/width";
import InputError from "../InputError";

export type KernTimeInputProps = Readonly<{
  name: string;
  label?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: FieldWidth;
  helperText?: string;
}>;

const TimeInputBase = function TimeInputComponent({
  name,
  label,
  width,
  placeholder,
  errorMessages,
  helperText,
  inputRef,
}: KernTimeInputProps & { inputRef?: React.Ref<HTMLInputElement> }) {
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

const MaskedTimeInput = IMaskMixin<HTMLInputElement, KernTimeInputProps>(
  ({ inputRef, ...props }) => <TimeInputBase {...props} inputRef={inputRef} />,
);

const KernTimeInput = (props: KernTimeInputProps) => {
  return (
    <MaskedTimeInput
      {...props}
      {...({ mask: "`0`0:`0`0", eager: "append" } as any)}
    />
  );
};

export default KernTimeInput;

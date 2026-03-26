import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { IMaskMixin } from "react-imask";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "~/components/kern/formElements/InputError";

export type KernDateInputProps = Readonly<{
  name: string;
  label?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  helperText?: string;
}>;

type MaskedInputProps = KernDateInputProps & {
  readonly mask: string | RegExp;
  readonly eager?: boolean | ("remove" | "append");
};

const DateInputBase = function DateInputComponent({
  name,
  label,
  placeholder,
  errorMessages,
  helperText,
  inputRef,
}: KernDateInputProps & { inputRef?: React.Ref<HTMLInputElement> }) {
  const field = useField(name);
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div
      className={classNames("kern-form-input", {
        "kern-form-input--error": field.error(),
      })}
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

const MaskedDateInput = IMaskMixin<HTMLInputElement, KernDateInputProps>(
  ({ inputRef, ...props }) => <DateInputBase {...props} inputRef={inputRef} />,
);

const KernDateInput = (props: KernDateInputProps) => {
  return (
    <MaskedDateInput
      {...props}
      {...({ mask: "0`0`.0`0`.0`0`0`0", eager: "append" } as MaskedInputProps)}
      placeholder="TT.MM.JJJJ"
    />
  );
};

export default KernDateInput;

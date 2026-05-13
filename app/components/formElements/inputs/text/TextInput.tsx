import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from "~/components/common/types";
import InputError from "../error/InputError";
import { type InputHTMLAttributes } from "react";
import { InputLabel } from "../label/InputLabel";
import { InputHelperText } from "../helperText/InputHelperText";

export type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  step?: string | number;
  prefix?: string;
  suffix?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  readonly?: boolean;
  charLimit?: number;
  helperText?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  ariaDescribedBy?: InputHTMLAttributes<HTMLInputElement>["aria-describedby"];
  /**
   * Any TextInput could theoretically be controlled by another input on the same page,
   * for example, the IbanInput and bank name.
   */
  controlled?: boolean;
}>;

const TextInput = function InputComponent({
  name,
  label,
  suffix,
  inputRef,
  readonly,
  helperText,
  placeholder,
  errorMessages,
  ariaDescribedBy,
  controlled = true,
  charLimit = INPUT_CHAR_LIMIT,
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
        })}
        {...(controlled
          ? {
              value: (field.value() as string | number | undefined) ?? "",
              defaultValue: undefined,
            }
          : {})}
        name={name}
        type="text"
        placeholder={placeholder}
        maxLength={charLimit}
        readOnly={readonly}
        aria-invalid={field.error() !== null}
        aria-describedby={[
          field.error() && errorId,
          helperText && helperId,
          ariaDescribedBy,
        ].join(" ")}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
        ref={inputRef}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default TextInput;

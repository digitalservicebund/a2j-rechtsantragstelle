import { type FieldApi, useField } from "@rvf/react-router";
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

const getInputValue = (field: FieldApi<unknown>, controlled: boolean) => {
  if (field.getInputProps().value !== undefined) {
    return field.getInputProps().value;
  }

  /** For controlled fields we want to use field.value() because can be modified by another input, e.g. the bank name is modified by the IbanInput.
   * In case the value is undefined, we return an empty string to avoid uncontrolled input warnings.
   * */

  if (controlled) {
    return (field.value() as string | number | undefined) ?? "";
  }

  // For uncontrolled fields we want to always return undefined
  return undefined;
};

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
  controlled = false,
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
        value={getInputValue(field, controlled)}
        // Always have a defaultValue for uncontrolled inputs to avoid React warnings about switching between controlled and uncontrolled
        defaultValue={
          controlled ? undefined : field.getInputProps().defaultValue
        }
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

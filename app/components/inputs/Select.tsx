import classNames from "classnames";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { type ErrorMessageProps } from ".";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { widthClassname } from "./width";

export type SelectProps = {
  name: string;
  options: Array<{ value: string; text: string }>;
  label?: ReactNode;
  altLabel?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: "16" | "24" | "36" | "54";
  formId?: string;
};

const Select = ({
  name,
  label,
  options,
  placeholder,
  errorMessages,
  formId,
  width,
}: SelectProps) => {
  const { error, getInputProps } = useField(name, { formId });

  const selectClassName = classNames(
    "ds-select forced-color-adjust-none",
    {
      "has-error": error,
    },
    widthClassname(width),
  );
  const errorId = `${name}-error`;

  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}

      <select
        {...getInputProps({ id: name })}
        className={selectClassName}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          return (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Select;

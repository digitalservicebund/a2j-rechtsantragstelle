import classNames from "classnames";
import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { type ErrorMessageProps } from ".";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

export type SelectProps = {
  name: string;
  options: { value: string; text: string }[];
  label?: ReactNode;
  altLabel?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: "16" | "24" | "36" | "54";
  formId?: string;
};

const widthClass = (width: string) => {
  return {
    "16": "w-[22ch]",
    "24": "w-[30ch]",
    "36": "w-[42ch]",
    "54": "w-[60ch]",
  }[width];
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
    "ds-select",
    {
      "has-error": error,
    },
    width && widthClass(width),
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

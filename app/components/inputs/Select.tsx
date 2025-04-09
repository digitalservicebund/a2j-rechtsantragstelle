import { useField } from "@rvf/remix";
import classNames from "classnames";
import type { ReactNode } from "react";
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
  width,
}: SelectProps) => {
  const field = useField(name);

  const selectClassName = classNames(
    "ds-select forced-color-adjust-none",
    {
      "has-error": field.error(),
    },
    widthClassname(width),
  );
  const errorId = `${name}-error`;

  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}

      <select
        {...field.getInputProps({ id: name })}
        className={selectClassName}
        aria-invalid={field.error() !== undefined}
        aria-describedby={field.error() ? errorId : undefined}
        aria-errormessage={field.error() ? errorId : undefined}
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
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default Select;

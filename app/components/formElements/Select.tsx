import { useField } from "@rvf/react-router";
import classNames from "classnames";
import type { ReactNode } from "react";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { type ErrorMessageProps } from "../common/types";
import { widthClassname } from "../common/width";

export type SelectProps = {
  name: string;
  options: Array<{ value: string; text: string }>;
  label?: ReactNode;
  altLabel?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: "16" | "24" | "36" | "54";
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
    "ds-select forced-colors:border-4",
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
        aria-invalid={field.error() !== null}
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

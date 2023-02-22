import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";

type SelectProps = {
  name: string;
  label?: ReactNode;
  options: string[];
};

export const Select = ({ name, label, options }: SelectProps) => {
  const { error, getInputProps } = useField(name);

  const selectClassName = classNames("ds-select", {
    "has-error": error,
  });

  return (
    <div>
      {label ? <InputLabel id={name}>{label}</InputLabel> : ""}

      <select
        {...getInputProps({ id: name })}
        className={selectClassName}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => {
          return (
            <option value={option} key={option}>
              {option}
            </option>
          );
        })}
      </select>

      {error ? <InputError id={name}>{error}</InputError> : ""}
    </div>
  );
};

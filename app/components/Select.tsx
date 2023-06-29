import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";

type SelectOptionProps = {
  text: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: ReactNode;
  options: SelectOptionProps[];
};

const Select = ({ name, label, options }: SelectProps) => {
  const { error, getInputProps } = useField(name);

  const selectClassName = classNames("ds-select", {
    "has-error": error,
  });
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
        {options.map((option) => {
          return (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
      <InputError id={errorId}>{error}</InputError>
    </div>
  );
};

export default Select;

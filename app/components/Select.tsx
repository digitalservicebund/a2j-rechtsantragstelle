import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";
import type { SelectOption } from "~/services/cms/models/formComponents";

type SelectProps = {
  name: string;
  label?: ReactNode;
  options: SelectOption[];
};

const Select = ({ name, label, options }: SelectProps) => {
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
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>

      {error ? <InputError inputName={name}>{error}</InputError> : ""}
    </div>
  );
};

export default Select;

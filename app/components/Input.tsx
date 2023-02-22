import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";

type InputProps = {
  name: string;
  label?: ReactNode;
  type?: string;
};

const Input = ({ name, label, type = "text" }: InputProps) => {
  const { error, getInputProps } = useField(name);

  const inputClassName = classNames("ds-input", {
    "has-error": error,
  });

  return (
    <div>
      {label ? <InputLabel id={name}>{label}</InputLabel> : ""}

      <input
        {...getInputProps({ type, id: name })}
        className={inputClassName}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {error ? <InputError id={name}>{error}</InputError> : ""}
    </div>
  );
};

export default Input;

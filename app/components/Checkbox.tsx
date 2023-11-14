import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type CheckboxProps = {
  name: string;
  value: string;
  onClick?: () => void;
  text?: ReactNode;
};

const Checkbox = ({ name, value, onClick, text }: CheckboxProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div className="flex">
      <input
        {...getInputProps({ type: "checkbox", id, value })}
        key={id}
        className="ds-checkbox"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      {<label htmlFor={id}>{text}</label>}
    </div>
  );
};

export default Checkbox;

import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type CheckboxProps = {
  name: string;
  value?: string; // Defaults to "on", see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox#value
  onClick?: () => void;
  label?: ReactNode;
  formId?: string;
};

const Checkbox = ({
  name,
  value = "on",
  onClick,
  label: text,
  formId,
}: CheckboxProps) => {
  const { error, getInputProps } = useField(name, { formId });
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

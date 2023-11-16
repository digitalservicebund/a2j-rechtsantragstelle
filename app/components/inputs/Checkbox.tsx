import { useField } from "remix-validated-form";

type CheckboxProps = {
  name: string;
  value?: string; // Defaults to "on", see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox#value
  onClick?: () => void;
  label?: string;
  formId?: string;
};

const Checkbox = ({
  name,
  value = "on",
  onClick,
  label,
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
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default Checkbox;

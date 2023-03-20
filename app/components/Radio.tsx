import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type RadioProps = {
  name: string;
  value: string;
  label?: ReactNode;
  contentLabel?: string;
};

const Radio = ({ name, value, label, contentLabel }: RadioProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div>
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="ds-radio"
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <label htmlFor={id}>{contentLabel || label}</label>
    </div>
  );
};

export default Radio;

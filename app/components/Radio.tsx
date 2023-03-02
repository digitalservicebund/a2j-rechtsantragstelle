import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type RadioProps = {
  name: string;
  value: string;
  children: ReactNode;
};

const Radio = ({ name, value, children }: RadioProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div>
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="ds-radio"
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;

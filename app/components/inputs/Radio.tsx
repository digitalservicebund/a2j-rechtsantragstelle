import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type RadioProps = {
  readonly name: string;
  readonly value: string;
  readonly onClick?: () => void;
  readonly text?: ReactNode;
  readonly formId?: string;
};

const Radio = ({ name, value, onClick, text, formId }: RadioProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const id = `${name}-${value}`;

  return (
    <div className="flex">
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="ds-radio forced-colors:appearance-auto forced-colors:focus-visible:outline-none"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      {<label htmlFor={id}>{text}</label>}
    </div>
  );
};

export default Radio;

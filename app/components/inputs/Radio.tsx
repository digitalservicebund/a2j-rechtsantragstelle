import type { ReactNode } from "react";
import { useField } from "remix-validated-form";

type RadioProps = {
  name: string;
  value: string;
  onClick?: () => void;
  text?: ReactNode;
};

const Radio = ({ name, value, onClick, text }: RadioProps) => {
  const { error, getInputProps } = useField(name);
  const id = `${name}-${value}`;

  return (
    <div className="flex">
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="ds-radio"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
      />
      {<label htmlFor={id}>{text}</label>}
    </div>
  );
};

export default Radio;

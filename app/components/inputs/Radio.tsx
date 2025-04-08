import { useField } from "@rvf/react-router";
import type { ReactNode } from "react";

type RadioProps = {
  readonly name: string;
  readonly value: string;
  readonly onClick?: () => void;
  readonly text?: ReactNode;
  readonly formId?: string;
};

const Radio = ({ name, value, onClick, text }: RadioProps) => {
  const field = useField(name);
  const id = `${name}-${value}`;

  return (
    <div className="flex">
      <input
        {...field.getInputProps({ type: "radio", id, value })}
        className="ds-radio forced-colors:outline forced-colors:border-[ButtonText]"
        aria-describedby={field.error() ? `${name}-error` : undefined}
        onClick={onClick}
      />
      {<label htmlFor={id}>{text}</label>}
    </div>
  );
};

export default Radio;

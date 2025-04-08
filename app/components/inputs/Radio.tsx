import type { ReactNode } from "react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type RadioProps = {
  readonly name: string;
  readonly value: string;
  readonly onClick?: () => void;
  readonly text?: ReactNode;
  readonly formId?: string;
};

function Radio(
  { name, value, onClick, text, formId }: RadioProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const { error, getInputProps } = useField(name, { formId });
  const id = `${name}-${value}`;

  return (
    <div className="flex">
      <input
        {...getInputProps({ type: "radio", id, value })}
        className="ds-radio forced-colors:outline forced-colors:border-[ButtonText]"
        aria-describedby={error && `${name}-error`}
        onClick={onClick}
        ref={ref}
      />
      <label htmlFor={id}>{text}</label>
    </div>
  );
}

export default forwardRef(Radio);

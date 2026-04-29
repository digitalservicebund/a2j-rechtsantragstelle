import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ReactNode } from "react";

type RadioInputProps = {
  readonly name: string;
  readonly value: string;
  readonly onClick?: () => void;
  readonly text?: ReactNode;
  readonly ref: React.Ref<HTMLInputElement>;
};

export const KernRadioInput = ({
  name,
  value,
  onClick,
  text,
  ref,
}: RadioInputProps) => {
  const field = useField(name);
  const id = `${name}-${value}`;
  return (
    <div className="kern-form-check">
      <input
        {...field.getInputProps({ type: "radio", id, value })}
        className={classNames("kern-form-check__radio", {
          "kern-form-check__radio--error": Boolean(field.error()),
        })}
        onClick={onClick}
        ref={ref}
      />
      <label className="kern-label" htmlFor={id}>
        {text}
      </label>
    </div>
  );
};

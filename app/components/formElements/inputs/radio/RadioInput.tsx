import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ReactNode } from "react";
import { InputLabel } from "../label/InputLabel";

type RadioInputProps = {
  readonly ref: React.Ref<HTMLInputElement>;
  readonly name: string;
  readonly value: string;
  readonly text?: ReactNode;
  readonly suffix?: string;
};

export const RadioInput = ({
  ref,
  text,
  name,
  value,
  suffix,
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
        ref={ref}
      />
      <InputLabel name={id} label={text} suffix={suffix} />
    </div>
  );
};

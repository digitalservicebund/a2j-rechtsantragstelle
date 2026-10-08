import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useId, type ReactNode } from "react";
import { InputLabel } from "../label/InputLabel";

type RadioInputProps = {
  readonly ref: React.Ref<HTMLInputElement>;
  readonly name: string;
  readonly value: string;
  readonly text?: ReactNode;
  readonly suffix?: string;
  readonly disabled?: boolean;
};

export const RadioInput = ({
  ref,
  text,
  name,
  value,
  suffix,
  disabled,
}: RadioInputProps) => {
  const field = useField(name);
  const idRandom = useId();
  // Radio group is rendering many times on the same page with the same name (modal TGA), but the id should be unique
  const id = `${name}-${value}-${idRandom}`;

  return (
    <div className="kern-form-check">
      <input
        {...field.getInputProps({ type: "radio", id, value })}
        className={classNames("kern-form-check__radio", {
          "kern-form-check__radio--error": Boolean(field.error()),
        })}
        ref={ref}
        disabled={disabled}
      />
      <InputLabel name={id} label={text} suffix={suffix} />
    </div>
  );
};

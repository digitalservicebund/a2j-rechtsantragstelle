import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";
import type { FieldErrorContent } from "~/services/cms/getPageConfig";

type InputProps = {
  name: string;
  label?: ReactNode;
  type?: string;
  step?: string;
  errors?: FieldErrorContent[];
};

const Input = ({ name, label, type = "text", step, errors }: InputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <input
        {...getInputProps({ type, step, id: name })}
        className={classNames("ds-input", { "has-error": error })}
        aria-describedby={error && `${name}-error`}
      />
      {error && (
        <InputError inputName={name}>
          {errors?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      )}
    </div>
  );
};

export default Input;

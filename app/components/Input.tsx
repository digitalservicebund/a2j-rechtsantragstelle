import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import { InputError, InputLabel } from "~/components";
import type { ErrorCategory } from "~/services/cms/models/formComponents";
import { flattenErrorCodes } from "~/services/cms/getPageConfig";

type InputProps = {
  name: string;
  label?: ReactNode;
  type?: string;
  step?: string;
  placeholder?: string;
  errors?: ErrorCategory[];
};

const Input = ({
  name,
  label,
  type = "text",
  step,
  placeholder,
  errors,
}: InputProps) => {
  const { error, getInputProps } = useField(name);
  const flattenedErrorCodes = flattenErrorCodes(errors);
  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <input
        {...getInputProps({
          type: type === "number" ? "text" : type,
          step,
          id: name,
          inputMode: type === "number" ? "numeric" : undefined,
          placeholder,
        })}
        className={classNames("ds-input", { "has-error": error })}
        aria-describedby={error && `${name}-error`}
      />
      {error && (
        <InputError inputName={name}>
          {flattenedErrorCodes?.find((err) => err.code === error)?.text ??
            error}
        </InputError>
      )}
    </div>
  );
};

export default Input;

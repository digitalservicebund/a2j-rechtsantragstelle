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
  prefix?: string;
  suffix?: string;
  defaultValue?: string;
  errors?: { attributes: ErrorCategory }[];
};

const Input = ({
  name,
  label,
  type = "text",
  step,
  placeholder,
  prefix,
  suffix,
  defaultValue,
  errors,
}: InputProps) => {
  const { error, getInputProps } = useField(name);
  const flattenedErrorCodes = flattenErrorCodes(errors);
  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <div className="ds-input-group">
        {prefix && <div className="ds-input-prefix">{prefix}</div>}
        <input
          {...getInputProps({
            type: type === "number" ? "text" : type,
            step,
            id: name,
            inputMode: type === "number" ? "decimal" : undefined,
            placeholder,
          })}
          className={classNames("ds-input", { "has-error": error })}
          aria-describedby={error && `${name}-error`}
          defaultValue={defaultValue}
        />
        {suffix && <div className="ds-input-suffix">{suffix}</div>}
      </div>
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

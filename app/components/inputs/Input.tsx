import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { type ErrorMessageProps } from ".";
import React from "react";
import DataListInput from "./DataListInput";

export type InputProps = Readonly<{
  name: string;
  label?: string;
  type?: string;
  step?: string | number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  errorMessages?: ErrorMessageProps[];
  helperText?: string;
  width?: "3" | "5" | "7" | "10" | "16" | "24" | "36" | "54";
  formId?: string;
  dataList?: "airports";
}>;

const widthClass = (width: string) => {
  return {
    "3": "w-[9ch]",
    "5": "w-[11ch]",
    "7": "w-[13ch]",
    "10": "w-[16ch]",
    "16": "w-[22ch]",
    "24": "w-[30ch]",
    "36": "w-[42ch]",
    "54": "w-[60ch]",
  }[width];
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function InputComponent(
    {
      name,
      label,
      type = "text",
      step,
      placeholder,
      prefix,
      suffix,
      errorMessages,
      helperText,
      width,
      formId,
      dataList,
    },
    ref,
  ) {
    const { error, getInputProps } = useField(name, { formId });
    const errorId = `${name}-error`;
    const helperId = `${name}-helper`;

    return (
      // TODO: This is a one-time hack for /geld-einklagen/formular/forderung/gegenseite. We should move to input groups asap
      <div className={`${name == "forderung.forderung1.title" ? "pb-40" : ""}`}>
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
            ref={ref}
            className={classNames(
              "ds-input forced-color-adjust-none",
              { "has-error": error },
              width && widthClass(width),
            )}
            aria-invalid={error !== undefined}
            aria-describedby={[error && errorId, helperText && helperId].join(
              " ",
            )}
            aria-errormessage={error && errorId}
            list={dataList && `data-list-${name}`}
          />
          {dataList && <DataListInput inputName={name} dataList={dataList} />}
          {suffix && (
            <div className="ds-input-suffix" aria-hidden="true">
              {suffix}
            </div>
          )}
        </div>
        <div className="label-text mt-6" id={helperId}>
          {helperText}
        </div>
        <InputError id={errorId}>
          {errorMessages?.find((err) => err.code === error)?.text ?? error}
        </InputError>
      </div>
    );
  },
);

export default Input;

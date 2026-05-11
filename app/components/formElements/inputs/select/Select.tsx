import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type ReactNode } from "react";
import { type ErrorMessageProps } from "~/components/common/types";
import { widthClassname } from "~/components/common/width";
import InputError from "../error/InputError";

type SelectProps = {
  name: string;
  label?: ReactNode;
  width?: "16" | "24" | "36" | "54";
  options: Array<{ value: string; text: string }>;
  suffix?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
};

const Select = ({
  name,
  label,
  width,
  suffix,
  options,
  placeholder,
  errorMessages,
}: SelectProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;

  return (
    <div className="kern-form-input">
      {label && (
        <label className="kern-label" htmlFor={name}>
          {label}
          {suffix && <span className="kern-label__optional">{suffix}</span>}
        </label>
      )}
      <div
        data-testid="select-wrapper"
        className={classNames(
          "kern-form-input__select-wrapper",
          {
            "kern-form-input__select-wrapper--error": field.error(),
          },
          widthClassname(width),
        )}
      >
        <select
          className="kern-form-input__select bg-white!"
          {...field.getInputProps({ id: name })}
          aria-invalid={field.error() !== null}
          aria-describedby={field.error() ? errorId : undefined}
          aria-errormessage={field.error() ? errorId : undefined}
          aria-required={
            !!errorMessages?.find((err) => err.code === "required")
          }
          data-testid="select"
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => {
            return (
              <option value={option.value} key={option.value}>
                {option.text}
              </option>
            );
          })}
        </select>
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default Select;

import { useField } from "@rvf/react-router";
import { type ReactNode } from "react";
import { type ErrorMessageProps } from "~/components/common/types";

export type SelectProps = {
  name: string;
  options: Array<{ value: string; text: string }>;
  label?: ReactNode;
  altLabel?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  width?: "16" | "24" | "36" | "54";
};

const KernSelect = ({
  label,
  name,
  errorMessages,
  options,
  width,
  altLabel,
  placeholder,
}: SelectProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;

  return (
    <div className="kern-form-input">
      {label && (
        <label className="kern-label" htmlFor="select">
          {label}
        </label>
      )}
      <div className="kern-form-input__select-wrapper">
        <select
          className="kern-form-input__select"
          {...field.getInputProps({ id: name })}
          aria-invalid={field.error() !== null}
          aria-describedby={field.error() ? errorId : undefined}
          aria-errormessage={field.error() ? errorId : undefined}
          aria-required={
            !!errorMessages?.find((err) => err.code === "required")
          }
        >
          {options.map((option) => {
            return (
              <option value={option.value} key={option.value}>
                {option.text}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default KernSelect;

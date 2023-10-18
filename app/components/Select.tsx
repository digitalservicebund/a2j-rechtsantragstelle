import type { ReactNode } from "react";
import { z } from "zod";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { ErrorMessagePropsSchema } from ".";

export const DropdownPropsSchema = z.object({
  name: z.string(),
  options: z.array(z.object({ value: z.string(), text: z.string() })),
  label: z.custom<ReactNode>().optional(),
  altLabel: z.string().optional(),
  placeholder: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
});

type SelectProps = z.infer<typeof DropdownPropsSchema>;

const Select = ({
  name,
  label,
  options,
  placeholder,
  errorMessages,
}: SelectProps) => {
  const { error, getInputProps } = useField(name);

  const selectClassName = classNames("ds-select", {
    "has-error": error,
  });
  const errorId = `${name}-error`;

  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}

      <select
        {...getInputProps({ id: name })}
        className={selectClassName}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          return (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Select;

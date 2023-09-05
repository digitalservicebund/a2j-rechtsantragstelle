import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { z } from "zod";

const ErrorMessagePropsSchema = z.object({
  code: z.string(),
  text: z.string(),
});

export const InputPropsSchema = z.object({
  name: z.string(),
  label: z.custom<ReactNode>().optional(),
  type: z.string().optional(),
  step: z.string().optional(),
  placeholder: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
  width: z.enum(["3", "5", "7", "10", "16", "24", "36", "54"]).optional(),
});

export type InputProps = z.infer<typeof InputPropsSchema>;

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

const Input = ({
  name,
  label,
  type = "text",
  step,
  placeholder,
  prefix,
  suffix,
  errorMessages,
  width,
}: InputProps) => {
  const { error, getInputProps } = useField(name);
  const errorId = `${name}-error`;

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
          className={classNames(
            "ds-input",
            { "has-error": error },
            width && widthClass(width),
          )}
          aria-invalid={error !== undefined}
          aria-describedby={error && errorId}
          aria-errormessage={error && errorId}
        />
        {suffix && <div className="ds-input-suffix">{suffix}</div>}
      </div>
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Input;

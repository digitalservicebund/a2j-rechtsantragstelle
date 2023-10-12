import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { z } from "zod";
import { ErrorMessagePropsSchema } from ".";

export const TextareaPropsSchema = z.object({
  name: z.string(),
  label: z.custom<ReactNode>().optional(),
  placeholder: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
});

export type TextareaProps = z.infer<typeof TextareaPropsSchema>;

const Textarea = ({
  name,
  label,
  placeholder,
  errorMessages,
}: TextareaProps) => {
  const { error, getInputProps } = useField(name);
  const errorId = `${name}-error`;

  return (
    <div>
      {label && <InputLabel id={name}>{label}</InputLabel>}
      <textarea
        {...getInputProps({
          id: name,
          placeholder,
        })}
        className={classNames("ds-textarea", { "has-error": error })}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Textarea;

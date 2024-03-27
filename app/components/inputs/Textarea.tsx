import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { z } from "zod";
import { ErrorMessagePropsSchema } from ".";
import RichText from "../RichText";

export const TextareaPropsSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  label: z.custom<ReactNode>().optional(),
  placeholder: z.string().optional(),
  errorMessages: z.array(ErrorMessagePropsSchema).optional(),
  formId: z.string().optional(),
});

type TextareaProps = z.infer<typeof TextareaPropsSchema>;

const Textarea = ({
  name,
  description,
  formId,
  label,
  placeholder,
  errorMessages,
}: TextareaProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;

  return (
    <div className="ds-stack-8">
      {label && (
        <InputLabel
          classname={description ? "ds-heading-03-reg" : ""}
          id={name}
        >
          {label}
        </InputLabel>
      )}
      {description && (
        <RichText className={"ds-body-01-reg"} markdown={description} />
      )}
      <textarea
        {...getInputProps({
          id: name,
          placeholder,
        })}
        className={classNames("ds-textarea placeholder-gray-600", {
          "has-error": error,
        })}
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

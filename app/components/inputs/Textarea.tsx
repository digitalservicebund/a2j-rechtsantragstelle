import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import classNames from "classnames";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { type ErrorMessageProps } from ".";
import RichText from "../RichText";

type TextareaProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  formId?: string;
}>;

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
        className={classNames(
          "ds-textarea forced-color-adjust-none placeholder-gray-600",
          {
            "has-error": error,
          },
        )}
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

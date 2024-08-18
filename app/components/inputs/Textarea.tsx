import classNames from "classnames";
import type { AriaRole, ReactNode } from "react";
import { useField } from "remix-validated-form";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from ".";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import RichText from "../RichText";

type TextareaProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  formId?: string;
  classNameLabel?: string;
  role?: AriaRole;
  innerRef?: React.Ref<HTMLTextAreaElement>;
}>;

const Textarea = ({
  name,
  description,
  formId,
  label,
  placeholder,
  errorMessages,
  classNameLabel,
  role,
  innerRef,
}: TextareaProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;

  return (
    <div className="ds-stack-8">
      {label && (
        <InputLabel
          classname={description ? "ds-heading-03-reg" : classNameLabel}
          id={name}
          role={role}
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
          maxLength: TEXTAREA_CHAR_LIMIT,
        })}
        className={classNames(
          "ds-textarea forced-color-adjust-none placeholder-gray-600",
          {
            "has-error": error,
          },
        )}
        ref={innerRef}
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

import classNames from "classnames";
import type { AriaRole, ReactNode } from "react";
import { useField } from "remix-validated-form";
import { Details } from "~/components/Details";
import InputLabel from "~/components/inputs/InputLabel";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from ".";
import InputError from "./InputError";
import RichText from "../RichText";

export type TextareaProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  details?: {
    title: string;
    content: string;
  };
  placeholder?: string;
  maxLength?: number;
  errorMessages?: ErrorMessageProps[];
  formId?: string;
  classNameLabel?: string;
  role?: AriaRole;
  innerRef?: React.Ref<HTMLTextAreaElement>;
}>;

export const TEXT_AREA_ROWS = 3;

const Textarea = ({
  name,
  description,
  formId,
  label,
  details,
  placeholder,
  maxLength = TEXTAREA_CHAR_LIMIT,
  errorMessages,
  classNameLabel,
  role,
  innerRef,
}: TextareaProps) => {
  const { error, getInputProps } = useField(name, { formId });
  const errorId = `${name}-error`;

  return (
    <div className="ds-stack ds-stack-8">
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
        <RichText className="ds-body-01-reg" html={description} />
      )}
      {details && <Details {...details} />}
      <textarea
        {...getInputProps({
          id: name,
          placeholder,
        })}
        maxLength={maxLength}
        rows={TEXT_AREA_ROWS}
        className={classNames("ds-textarea forced-color-adjust-none", {
          "has-error": error,
        })}
        ref={innerRef}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        aria-errormessage={error && errorId}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === error)?.text ?? error}
      </InputError>
    </div>
  );
};

export default Textarea;

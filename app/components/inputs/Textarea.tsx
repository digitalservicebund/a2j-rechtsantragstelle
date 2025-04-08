import { useField } from "@rvf/react-router";
import classNames from "classnames";
import type { AriaRole, ReactNode } from "react";
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
  label,
  details,
  placeholder,
  maxLength = TEXTAREA_CHAR_LIMIT,
  errorMessages,
  classNameLabel,
  role,
  innerRef,
}: TextareaProps) => {
  const field = useField(name);
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
        {...field.getInputProps({
          id: name,
          placeholder,
        })}
        maxLength={maxLength}
        rows={TEXT_AREA_ROWS}
        className={classNames("ds-textarea forced-color-adjust-none", {
          "has-error": field.error(),
        })}
        ref={innerRef}
        aria-invalid={field.error() !== undefined}
        aria-describedby={field.error() ? errorId : undefined}
        aria-errormessage={field.error() ? errorId : undefined}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      />
      <InputError id={errorId}>
        {errorMessages?.find((err) => err.code === field.error())?.text ??
          field.error()}
      </InputError>
    </div>
  );
};

export default Textarea;

import { useField } from "@rvf/react-router";
import classNames from "classnames";
import type { ReactNode } from "react";
import { getGeldEinklagenTextareaRows } from "~/domains/geldEinklagen/formular/klage-erstellen/longTextFieldConfig";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from "../common/types";
import KernRichText from "../kern/KernRichText";
import InputError from "../kern/formElements/InputError";
import { Details } from "../content/Details";

export const TEXT_AREA_ROWS = 3;

type TextareaProps = Readonly<{
  name: string;
  backgroundClass?: string;
  description?: string;
  label?: ReactNode;
  details?: {
    title: string;
    content: string;
  };
  placeholder?: string;
  maxLength?: number;
  errorMessages?: ErrorMessageProps[];
  innerRef?: React.Ref<HTMLTextAreaElement>;
  ariaDescribedby?: string;
}>;

const Textarea = ({
  name,
  backgroundClass,
  description,
  label,
  details,
  placeholder,
  maxLength = TEXTAREA_CHAR_LIMIT,
  errorMessages,
  innerRef,
  ariaDescribedby,
}: TextareaProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;

  return (
    <div
      className={classNames("kern-form-input gap-kern-space-small!", {
        "kern-form-input--error": field.error(),
      })}
    >
      {label && (
        <label className="kern-label" htmlFor={name}>
          {label}
        </label>
      )}
      {description && <KernRichText html={description} />}
      {details && <Details {...details} />}
      <textarea
        {...field.getInputProps({
          id: name,
          placeholder,
        })}
        maxLength={maxLength}
        rows={getGeldEinklagenTextareaRows(name) ?? TEXT_AREA_ROWS}
        className={classNames(
          "kern-form-input__input ph-no-capture h-fit!",
          {
            "kern-form-input__input--error": field.error(),
            "bg-white!": !backgroundClass,
          },
          backgroundClass,
        )}
        ref={innerRef}
        aria-invalid={field.error() !== null}
        aria-describedby={field.error() ? errorId : ariaDescribedby}
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

import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState, type ReactNode } from "react";
import { type ErrorMessageProps } from "~/components/common/types";
import { Details } from "~/components/content/Details";
import { getGeldEinklagenTextareaRows } from "~/domains/geldEinklagen/formular/klage-erstellen/longTextFieldConfig";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import InputError from "../error/InputError";
import RichText from "../../../common/RichText";
import { InputLabel } from "../label/InputLabel";

export const TEXT_AREA_ROWS = 3;

type TextareaProps = Readonly<{
  name: string;
  label?: ReactNode;
  details?: {
    title: string;
    content: string;
  };
  suffix?: string;
  innerRef?: React.Ref<HTMLTextAreaElement>;
  maxLength?: number;
  description?: string;
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
  backgroundClass?: string;
  ariaDescribedby?: string;
}>;

const Textarea = ({
  name,
  label,
  suffix,
  details,
  innerRef,
  description,
  placeholder,
  errorMessages,
  ariaDescribedby,
  backgroundClass,
  maxLength = TEXTAREA_CHAR_LIMIT,
}: TextareaProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;

  const [detailsId, setDetailsId] = useState<string | undefined>();

  const describedByIds = [
    field.error() ? errorId : null,
    ariaDescribedby,
    detailsId,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames("kern-form-input gap-kern-space-small!", {
        "kern-form-input--error": field.error(),
      })}
    >
      {label && <InputLabel name={name} label={label} suffix={suffix} />}
      {description && <RichText html={description} />}
      {details && <Details {...details} onContentId={setDetailsId} />}
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
        aria-describedby={describedByIds || undefined}
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

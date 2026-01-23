import { useField } from "@rvf/react-router";
import classNames from "classnames";
import type { ReactNode } from "react";
import { Details } from "~/components/content/Details";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { type ErrorMessageProps } from "../../common/types";
import KernRichText from "../KernRichText";

type TextareaProps = Readonly<{
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
  innerRef?: React.Ref<HTMLTextAreaElement>;
  ariaDescribedby?: string;
}>;

const TEXT_AREA_ROWS = 3;

const KernTextarea = ({
  name,
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
    <div className="kern-form-input gap-kern-space-small!">
      {label && (
        <label className="kern-label" id={name}>
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
        rows={TEXT_AREA_ROWS}
        className={classNames("kern-form-input__input ph-no-capture", {
          "kern-form-input__input--error": field.error(),
        })}
        ref={innerRef}
        aria-invalid={field.error() !== null}
        aria-describedby={field.error() ? errorId : ariaDescribedby}
        aria-errormessage={field.error() ? errorId : undefined}
        aria-required={!!errorMessages?.find((err) => err.code === "required")}
      />
      {errorMessages && (
        <p className="kern-error" id="textarea-error" role="alert">
          <span
            className="kern-icon kern-icon--danger kern-icon--md"
            aria-hidden="true"
          ></span>
          <span className="kern-body">
            {errorMessages?.find((err) => err.code === field.error())?.text ??
              field.error()}
          </span>
        </p>
      )}
    </div>
  );
};

export default KernTextarea;

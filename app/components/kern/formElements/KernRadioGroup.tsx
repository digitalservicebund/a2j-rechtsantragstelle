import { useField } from "@rvf/react-router";
import { type ReactNode, useState } from "react";
import classNames from "classnames";
import { type ErrorMessageProps } from "~/components/common/types";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { KernRadioInput } from "./KernRadioInput";
import { KernIcon } from "../common/KernIcon";

type KernRadioGroupProps = Readonly<{
  name: string;
  options: Array<{
    value: string;
    text?: ReactNode;
  }>;
  label?: ReactNode;
  altLabel?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const KernRadioGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
}: KernRadioGroupProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());
  const errorToDisplay =
    errorMessages?.find((err) => err.code === field.error())?.text ??
    field.error();
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any radio option to still allow for front-end validation
  const [renderHiddenField, setRenderHiddenField] = useState(
    field.defaultValue() === undefined,
  );
  const jsAvailable = useJsAvailable();

  return (
    <fieldset
      className={classNames("kern-fieldset mt-16 mb-16", {
        "kern-fieldset--error": hasError,
      })}
      aria-invalid={hasError}
      aria-errormessage={hasError ? errorId : undefined}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} />
      )}
      <div className="kern-fieldset__body">
        {label && <legend className="kern-label">{label}</legend>}
        {options.map((o, index) => (
          <KernRadioInput
            key={o.value}
            name={name}
            value={o.value}
            text={o.text}
            onClick={() => setRenderHiddenField(false)}
            // Only assign the ref to the first radio button (https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
            ref={index === 0 && hasError ? field.refs.controlled() : null}
          />
        ))}
      </div>
      {errorToDisplay && (
        <p
          className="kern-error flex gap-8 self-center mt-8!"
          id={errorId}
          role="alert"
        >
          <KernIcon
            name="emergency-home"
            className="fill-kern-feedback-danger!"
          />
          <span className="text-kern-feedback-danger!">{errorToDisplay}</span>
        </p>
      )}
    </fieldset>
  );
};

export default KernRadioGroup;

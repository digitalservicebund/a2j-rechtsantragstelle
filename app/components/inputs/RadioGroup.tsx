import { useField } from "@rvf/react-router";
import { type ReactNode, useState } from "react";
import { useJsAvailable } from "~/services/hooks/useJsAvailable";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";
import { type ErrorMessageProps } from ".";
import InputError from "./InputError";
import Radio from "./Radio";

export type RadioGroupProps = Readonly<{
  name: string;
  options: Array<{
    value: string;
    text?: ReactNode;
  }>;
  label?: ReactNode;
  altLabel?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const RadioGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
}: RadioGroupProps) => {
  const field = useField(name);

  const errorId = `${name}-error`;
  const hasError = !isFieldEmptyOrUndefined(field.error() ?? "");
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
      className="border-0 p-0 m-0"
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} />
      )}
      <div className="ds-stack ds-stack-16">
        {label && <legend>{label}</legend>}
        {options.map((o, index) => (
          <Radio
            key={o.value}
            name={name}
            value={o.value}
            text={o.text}
            onClick={() => setRenderHiddenField(false)}
            // Only assign the ref to the first radio button (https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
            ref={index === 0 && hasError ? field.refs.controlled() : null}
          />
        ))}
        {errorToDisplay && (
          <InputError id={errorId}>{errorToDisplay}</InputError>
        )}
      </div>
    </fieldset>
  );
};

export default RadioGroup;

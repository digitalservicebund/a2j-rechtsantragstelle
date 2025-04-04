import { type ReactNode, useState, useEffect, useRef } from "react";
import { useStringField } from "~/services/validation/useStringField";
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
  formId?: string;
}>;

const RadioGroup = ({
  name,
  options,
  label,
  altLabel,
  errorMessages,
  formId,
}: RadioGroupProps) => {
  const { error, defaultValue } = useStringField(name, { formId });
  const errorRef = useRef<HTMLDivElement>(null);
  const errorId = `${name}-error`;
  const errorToDisplay =
    errorMessages?.find((err) => err.code === error)?.text ?? error;
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any radio option to still allow for front-end validation
  const [renderHiddenField, setRenderHiddenField] = useState(
    defaultValue === undefined,
  );

  useEffect(() => {
    if (errorToDisplay && errorRef.current) {
      errorRef.current.focus();
    }
  }, [errorToDisplay]);

  return (
    <fieldset
      className="border-0 p-0 m-0"
      aria-invalid={error !== undefined}
      aria-describedby={error && errorId}
      aria-errormessage={error && errorId}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      {renderHiddenField && <input type="hidden" name={name} />}
      <div className="ds-stack ds-stack-16">
        {label && <legend>{label}</legend>}
        {options.map((o) => (
          <Radio
            key={o.value}
            name={name}
            value={o.value}
            text={o.text}
            formId={formId}
            onClick={() => setRenderHiddenField(false)}
          />
        ))}
        {errorToDisplay && (
          <InputError id={errorId} ref={errorRef} tabIndex={0}>
            {errorToDisplay}
          </InputError>
        )}
      </div>
    </fieldset>
  );
};

export default RadioGroup;

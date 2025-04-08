import { useField } from "@rvf/react-router";
import { type ReactNode, useState } from "react";
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
  const field = useField(name);
  const errorId = `${name}-error`;
  const errorToDisplay =
    errorMessages?.find((err) => err.code === field.error())?.text ??
    field.error();
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any radio option to still allow for front-end validation
  const [renderHiddenField, setRenderHiddenField] = useState(
    field.defaultValue() === undefined,
  );

  return (
    <fieldset
      className="border-0 p-0 m-0"
      aria-invalid={field.error() !== undefined}
      aria-describedby={field.error() ? errorId : undefined}
      aria-errormessage={field.error() ? errorId : undefined}
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
          <InputError id={errorId}>{errorToDisplay}</InputError>
        )}
      </div>
    </fieldset>
  );
};

export default RadioGroup;

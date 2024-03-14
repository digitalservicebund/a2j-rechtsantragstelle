import { type ReactNode, useState } from "react";
import { useField } from "remix-validated-form";
import InputError from "./InputError";
import Radio from "./Radio";
import type { ErrorMessageProps } from "./ErrorMessageProps";

type RadioGroupProps = Readonly<{
  name: string;
  options: { value: string; text?: ReactNode }[];
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
  const { error, defaultValue } = useField(name);
  const errorId = `${name}-error`;
  const errorToDisplay =
    errorMessages?.find((err) => err.code === error)?.text ?? error;
  // Without JS, we need a same-named hidden field for validation without user input
  // It gets removed on clicking any radio option to still allow for front-end validation
  const [renderHiddenField, setRenderHiddenField] = useState(
    defaultValue === undefined,
  );

  return (
    <fieldset
      className="border-0 p-0 m-0"
      aria-invalid={error !== undefined}
      aria-describedby={error && errorId}
      aria-errormessage={error && errorId}
    >
      {altLabel && <legend className="sr-only">{altLabel}</legend>}
      {renderHiddenField && <input type="hidden" name={name} />}
      <div className="ds-stack-16">
        {label && <legend>{label}</legend>}
        {options.map((o) => (
          <Radio
            key={o.value}
            name={name}
            value={o.value}
            text={o.text}
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

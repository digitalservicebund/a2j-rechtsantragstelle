import { useStringField } from "~/services/validation/useStringField";
import { useEffect, useState } from "react";
import InputError from "./InputError";
import RichText from "../RichText";

export enum CheckboxValue {
  on = "on",
  off = "off",
}

type CheckboxProps = {
  readonly name: string;
  readonly value?: string; // Defaults to "on", see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox#value
  readonly label?: string;
  readonly formId?: string;
  readonly required?: boolean;
  readonly errorMessage?: string;
};

const Checkbox = ({
  name,
  value = CheckboxValue.on,
  label,
  formId,
  required = false,
  errorMessage,
}: CheckboxProps) => {
  const { error, getInputProps, defaultValue } = useStringField(name, {
    formId,
  });
  const errorId = `${name}-error`;
  const className = `ds-checkbox ${error ? "has-error" : ""}`;
  // HTML Forms do not send unchecked checkboxes.
  // For server-side validation we need a same-named hidden field
  // For front-end validation, we need to hide that field if checkbox is checked
  // const alreadyChecked = defaultValue === value
  const [renderHiddenField, setRenderHiddenField] = useState(
    defaultValue !== value,
  );
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  return (
    <div>
      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} value={CheckboxValue.off} />
      )}
      <input
        {...getInputProps({ type: "checkbox", id: name, value })}
        className={className}
        aria-describedby={error && errorId}
        onClick={() => setRenderHiddenField(!renderHiddenField)}
        required={required}
        defaultChecked={defaultValue === value}
      />

      {label && (
        <label htmlFor={name}>
          <RichText markdown={label} />
          {error && (
            <InputError id={errorId}>{errorMessage ?? error}</InputError>
          )}
        </label>
      )}
    </div>
  );
};

export default Checkbox;

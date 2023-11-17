import { useField } from "remix-validated-form";
import { useEffect, useState } from "react";
import InputError from "./InputError";
import RichText from "../RichText";

type CheckboxProps = {
  name: string;
  value?: string; // Defaults to "on", see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox#value
  label?: string;
  formId?: string;
  required?: boolean;
  errorMessage?: string;
};

const Checkbox = ({
  name,
  value = "on",
  label,
  formId,
  required = false,
  errorMessage,
}: CheckboxProps) => {
  const { error, getInputProps, defaultValue } = useField(name, { formId });
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
        <input type="hidden" name={name} value="off" />
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

import { useField } from "@rvf/react-router";
import { useEffect, useState } from "react";
import InputError from "./InputError";
import RichText from "../RichText";

export enum CheckboxValue {
  on = "on",
  off = "off",
}

export type CheckboxProps = Readonly<{
  name: string;
  value?: string; // Defaults to "on", see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/checkbox#value
  label?: string;
  formId?: string;
  required?: boolean;
  errorMessage?: string;
}>;

const Checkbox = ({
  name,
  value = CheckboxValue.on,
  label,
  required = false,
  errorMessage,
}: CheckboxProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const className = `ds-checkbox forced-colors:outline forced-colors:border-[ButtonText] ${field.error() ? "has-error" : ""}`;
  // HTML Forms do not send unchecked checkboxes.
  // For server-side validation we need a same-named hidden field
  // For front-end validation, we need to hide that field if checkbox is checked
  // const alreadyChecked = defaultValue === value
  const [renderHiddenField, setRenderHiddenField] = useState(
    field.defaultValue() !== value,
  );
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  return (
    <div className="flex flex-col flex-nowrap">
      <div className="flex items-center">
        {(!jsAvailable || renderHiddenField) && (
          <input type="hidden" name={name} value={CheckboxValue.off} />
        )}
        <input
          {...field.getInputProps({ type: "checkbox", id: name, value })}
          className={className}
          aria-describedby={field.error() ? errorId : undefined}
          onClick={() => setRenderHiddenField(!renderHiddenField)}
          required={required}
          defaultChecked={field.defaultValue() === value}
        />

        {label && (
          <label htmlFor={name}>
            <RichText html={label} />
          </label>
        )}
      </div>
      {field.error() && (
        <InputError id={errorId}>{errorMessage ?? field.error()}</InputError>
      )}
    </div>
  );
};

export default Checkbox;

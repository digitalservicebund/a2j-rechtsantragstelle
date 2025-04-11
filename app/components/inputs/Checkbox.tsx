import { useField } from "@rvf/remix";
import { useState } from "react";
import { useJsAvailable } from "~/services/useJsAvailabe";
import InputError from "./InputError";
import RichText from "../RichText";

export enum CheckboxValue {
  on = "on",
  off = "off",
}

export type CheckboxProps = Readonly<{
  name: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
}>;

const Checkbox = ({
  name,
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
  const [renderHiddenField, setRenderHiddenField] = useState(
    (field.defaultValue() as CheckboxValue) !== CheckboxValue.on,
  );
  const jsAvailable = useJsAvailable();

  return (
    <div className="flex flex-col flex-nowrap">
      <div className="flex items-center">
        {(!jsAvailable || renderHiddenField) && (
          <input type="hidden" name={name} value={CheckboxValue.off} />
        )}
        <input
          type="checkbox"
          id={name}
          name={name}
          defaultChecked={field.defaultValue() === CheckboxValue.on}
          value={CheckboxValue.on}
          className={className}
          aria-describedby={field.error() ? errorId : undefined}
          onClick={() => setRenderHiddenField(!renderHiddenField)}
          required={required}
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

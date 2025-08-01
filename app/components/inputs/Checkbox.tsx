import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import InputError from "./InputError";
import { useJsAvailable } from "../hooks/useJsAvailable";
import RichText from "../RichText";

export type CheckboxValue = "on" | "off";

export type CheckboxProps = Readonly<{
  name: string;
  label?: string;
  errorMessage?: string;
}>;

const Checkbox = ({ name, label, errorMessage }: CheckboxProps) => {
  const field = useField(name);

  const errorId = `${name}-error`;
  const className = classNames(
    "ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]",
    {
      // Angie does not implement focus visibility
      "has-error focus-visible:shadow-[inset_0_0_0_4px_theme(colors.red.800)]":
        field.error(),
    },
  );
  // HTML Forms do not send unchecked checkboxes.
  // For server-side validation we need a same-named hidden field
  // For front-end validation, we need to hide that field if checkbox is checked
  const [renderHiddenField, setRenderHiddenField] = useState(
    (field.defaultValue() as CheckboxValue) !== "on",
  );
  const jsAvailable = useJsAvailable();

  return (
    <div className="flex flex-col flex-nowrap">
      <div className="flex items-center">
        {(!jsAvailable || renderHiddenField) && (
          <input type="hidden" name={name} value={"off"} />
        )}
        <input
          type="checkbox"
          id={name}
          name={name}
          defaultChecked={field.defaultValue() === "on"}
          value={"on"}
          className={className}
          aria-describedby={field.error() ? errorId : undefined}
          onClick={() => setRenderHiddenField(!renderHiddenField)}
          aria-required={!!errorMessage}
          ref={field.error() ? field.refs.controlled() : null}
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

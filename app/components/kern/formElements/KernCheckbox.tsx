import classNames from "classnames";
import { useField } from "@rvf/react-router";
import { useState } from "react";
import InputError from "./InputError";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";

export type CheckboxValue = "on" | "off";

type KernCheckboxProps = Readonly<{
  name: string;
  label?: string;
  errorMessage?: string;
  required: boolean;
}>;

const KernCheckbox = ({
  name,
  label,
  errorMessage,
  required,
}: KernCheckboxProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  // HTML Forms do not send unchecked checkboxes.
  // For server-side validation we need a same-named hidden field
  // For front-end validation, we need to hide that field if checkbox is checked
  const [renderHiddenField, setRenderHiddenField] = useState(
    (field.defaultValue() as CheckboxValue) !== "on",
  );
  const jsAvailable = useJsAvailable();

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": Boolean(errorMessage),
      })}
    >
      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} value={"off"} />
      )}

      <div className="kern-fieldset__body">
        <div className="kern-form-check">
          <input
            className={classNames("kern-form-check__checkbox", {
              "kern-form-check__checkbox--error": Boolean(errorMessage),
              // Accessibility: use a red inset box-shadow on focus in the error state
              // to simulate focus (since the checkbox uses box-shadows for its borders)
              // and ensure users can clearly see the error.
              "has-error focus-visible:shadow-[inset_0_0_0_4px_var(--color-red-800)]":
                field.error(),
            })}
            id={name}
            name={name}
            type="checkbox"
            defaultChecked={field.defaultValue() === "on"}
            value={"on"}
            aria-describedby={field.error() ? errorId : undefined}
            onClick={() => setRenderHiddenField(!renderHiddenField)}
            aria-required={required}
            ref={field.error() ? field.refs.controlled() : null}
          />

          {label && (
            <label className="kern-label" htmlFor={name}>
              {label}
            </label>
          )}
        </div>
      </div>
      {field.error() && (
        <InputError id={errorId}>{errorMessage ?? field.error()}</InputError>
      )}
    </fieldset>
  );
};

export default KernCheckbox;

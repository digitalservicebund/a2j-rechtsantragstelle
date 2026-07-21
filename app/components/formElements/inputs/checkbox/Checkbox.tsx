import classNames from "classnames";
import { useField } from "@rvf/react-router";
import { useRef } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import InputError from "../error/InputError";
import { InputLabel } from "../label/InputLabel";

export type CheckboxValue = "on" | "off";

type CheckboxProps = Readonly<{
  name: string;
  label?: string;
  suffix?: string;
  required: boolean;
  errorMessage?: string;
}>;

const Checkbox = ({
  name,
  label,
  errorMessage,
  required,
  suffix,
}: CheckboxProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const hiddenFieldRef = useRef<HTMLInputElement>(null);
  const jsAvailable = useJsAvailable();
  const hasError = Boolean(field.error());
  const defaultChecked = (field.defaultValue() as CheckboxValue) === "on";

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      {/* HTML Forms do not send unchecked checkboxes, so for server side
      validation and the noJS fallback we need a same named hidden field.
      Its disabled state is toggled synchronously (via ref, not React state)
      in onClick so it's excluded from FormData before RVF's onChange
      revalidation reads the form, avoiding a race where both fields are
      briefly present at once. */}
      <input
        type="hidden"
        name={name}
        value="off"
        ref={hiddenFieldRef}
        disabled={jsAvailable && defaultChecked}
      />

      <div className="kern-fieldset__body">
        <div className="kern-form-check">
          <input
            {...field.getInputProps({ type: "checkbox", value: "on" })}
            className={classNames("kern-form-check__checkbox", {
              "kern-form-check__checkbox--error": hasError,
            })}
            id={name}
            aria-describedby={hasError ? errorId : undefined}
            onClick={(e) => {
              if (hiddenFieldRef.current) {
                hiddenFieldRef.current.disabled = e.currentTarget.checked;
              }
            }}
            aria-required={required}
            ref={hasError ? field.refs.transient() : null}
          />

          {label && <InputLabel label={label} name={name} suffix={suffix} />}
        </div>
      </div>
      {field.error() && (
        <InputError id={errorId}>{errorMessage ?? field.error()}</InputError>
      )}
    </fieldset>
  );
};

export default Checkbox;

import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { type z } from "zod";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type StrapiStandaloneCheckboxComponentSchema } from "~/services/cms/models/formElements/StrapiStandaloneCheckbox";
import InputError from "../error/InputError";
import { InputLabel } from "../label/InputLabel";

type StandaloneCheckboxProps = Omit<
  z.infer<typeof StrapiStandaloneCheckboxComponentSchema>,
  "id" | "__component" | "errorMessage"
> & {
  errorMessage?: string;
};

const StandaloneCheckbox = ({
  name,
  label,
  text,
  errorMessage,
  required,
}: StandaloneCheckboxProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const jsAvailable = useJsAvailable();
  const hasError = Boolean(field.error());
  const value = field.value();
  // Need this fallback as RVF treats checked checkboxes as "true" instead of "on"
  const isChecked = value === true || value === "on";

  return (
    <fieldset
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      {(!jsAvailable || !isChecked) && (
        <input type="hidden" name={name} value="off" />
      )}

      <div className="kern-fieldset__body">
        {label && <legend className="kern-label mb-0!">{label}</legend>}
        <div className="kern-form-check">
          <input
            {...field.getInputProps({ type: "checkbox", value: "on" })}
            className={classNames("kern-form-check__checkbox", {
              "kern-form-check__checkbox--error": hasError,
            })}
            id={name}
            aria-describedby={hasError ? errorId : undefined}
            aria-required={required}
            ref={hasError ? field.refs.transient() : null}
          />

          {text && <InputLabel label={text} name={name} />}
        </div>
      </div>
      {field.error() && (
        <InputError id={errorId}>{errorMessage ?? field.error()}</InputError>
      )}
    </fieldset>
  );
};

export default StandaloneCheckbox;

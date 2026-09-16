import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import InputError from "~/components/formElements/inputs/error/InputError";
import { InputLabel } from "~/components/formElements/inputs/label/InputLabel";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";

type Props = {
  name: string;
  options: Array<{ label: string; option: string }>;
};

export const ReuseBeweisCheckbox = ({ name, options }: Props) => {
  const field = useField<Record<string, string> | undefined>(name);
  const jsAvailable = useJsAvailable();

  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  const [checkboxes, setCheckboxes] = useState(
    options.map(({ label, option }) => ({
      name: `${name}.${option}`,
      option,
      label,
      value: field.value()?.[option] ?? "off",
    })),
  );

  return (
    <fieldset
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
      className={classNames("kern-fieldset", {
        "kern-fieldset--error": hasError,
      })}
    >
      <div className="kern-fieldset__body">
        {checkboxes.map(({ label, name: nameOption, option, value }) => {
          const showHiddenInput = !jsAvailable || value !== "on";

          return (
            <div key={nameOption} className="flex items-center">
              <div className="kern-form-check">
                {showHiddenInput && (
                  <input type="hidden" name={nameOption} value="off" />
                )}
                <input
                  type="checkbox"
                  name={nameOption}
                  id={nameOption}
                  className={classNames("kern-form-check__checkbox", {
                    "kern-form-check__checkbox--error": hasError,
                  })}
                  checked={value === "on"}
                  value={jsAvailable ? value : "on"}
                  onChange={(e) => {
                    const newValue = e.target.checked ? "on" : "off";
                    setCheckboxes((prev) =>
                      prev.map((checkbox) =>
                        checkbox.name === nameOption
                          ? { ...checkbox, value: newValue }
                          : checkbox,
                      ),
                    );
                    field.setValue({ ...field.value(), [option]: newValue });
                  }}
                />
                {label && <InputLabel name={nameOption} label={label} />}
              </div>
            </div>
          );
        })}
      </div>
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};

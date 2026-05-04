import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import { type ExclusiveCheckboxesType } from "~/services/validation/checkedCheckbox";
import InputError from "../InputError";
import { onCheckboxChange } from "./exclusiveCheckboxesChangeHandler";
import { ExclusiveCheckboxInput } from "./ExclusiveCheckboxInput";

type ExclusiveCheckboxesProps = Readonly<{
  name: string;
  options: readonly string[];
  labels?: Record<string, string | undefined>;
}>;

export const ExclusiveCheckboxes = ({
  name,
  options,
  labels,
}: ExclusiveCheckboxesProps) => {
  const field = useField<ExclusiveCheckboxesType | undefined>(name);
  const [noneCheckboxValue, setNoneCheckboxValue] = useState(
    field.value()?.none ?? "off",
  );
  const [checkboxes, setCheckboxes] = useState(
    options.map((option) => ({
      name: `${name}.${option}`,
      label: labels?.[option] ?? option,
      value: field.value()?.[option] ?? "off",
    })),
  );
  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());
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
        {checkboxes.filter(Boolean).map(({ name, ...checkbox }) =>
          name.split(".").pop() === "none" ? (
            <div key={name}>
              <p className="kern-label mb-24!">oder</p>
              <ExclusiveCheckboxInput
                name={name}
                {...checkbox}
                onChange={onCheckboxChange(
                  field,
                  checkboxes,
                  noneCheckboxValue,
                  setNoneCheckboxValue,
                  setCheckboxes,
                )}
                value={noneCheckboxValue}
                hasError={hasError}
              />
            </div>
          ) : (
            <ExclusiveCheckboxInput
              name={name}
              key={name}
              onChange={onCheckboxChange(
                field,
                checkboxes,
                noneCheckboxValue,
                setNoneCheckboxValue,
                setCheckboxes,
              )}
              {...checkbox}
              hasError={hasError}
            />
          ),
        )}
      </div>
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};

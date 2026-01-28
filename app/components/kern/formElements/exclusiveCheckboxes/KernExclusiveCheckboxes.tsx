import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { useState } from "react";
import { type ExclusiveCheckboxes } from "~/services/validation/checkedCheckbox";
import InputError from "../InputError";
import { KernExclusiveCheckboxInput } from "./KernExclusiveCheckboxInput";
import { onCheckboxChange } from "./exclusiveCheckboxesChangeHandler";

type KernExclusiveCheckboxesProps = Readonly<{
  name: string;
  options: readonly string[];
  labels?: Record<string, string | undefined>;
}>;

export const KernExclusiveCheckboxes = ({
  name,
  options,
  labels,
}: KernExclusiveCheckboxesProps) => {
  const field = useField<ExclusiveCheckboxes | undefined>(name);
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
              <p className="kern-label mb-32">oder</p>
              <KernExclusiveCheckboxInput
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
              />
            </div>
          ) : (
            <KernExclusiveCheckboxInput
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
            />
          ),
        )}
      </div>
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};

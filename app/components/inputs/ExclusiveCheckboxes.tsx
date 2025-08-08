import { useField } from "@rvf/react-router";
import { useState } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type CheckboxValue } from "~/components/inputs/Checkbox";
import InputError from "~/components/inputs/InputError";
import RichText from "~/components/RichText";
import { type StrapiCheckboxComponent } from "~/services/cms/components/StrapiCheckbox";
import {
  type CheckedOptional,
  type ExclusiveCheckboxes as ExclusiveCheckboxesType,
} from "~/services/validation/checkedCheckbox";

type ExclusiveCheckboxesProps = Readonly<{
  name: string;
  checkboxes: StrapiCheckboxComponent[];
}>;

export const ExclusiveCheckboxes = ({
  name,
  checkboxes,
}: ExclusiveCheckboxesProps) => {
  const field = useField<ExclusiveCheckboxesType>(name);
  const [noneValue, setNoneValue] = useState<CheckedOptional>(
    field.value().none,
  );
  const [checkboxValues, setCheckboxValues] = useState<
    Record<string, CheckboxValue>
  >(
    Object.fromEntries(
      Object.entries(field.value()).filter(([key]) => key !== "none"),
    ),
  );
  const errorId = `${name}-error`;
  return (
    <div>
      {Object.entries(checkboxValues).map(([checkboxName, checkboxValue]) => {
        const matchingCheckbox = checkboxes.find(
          (c) => c.name.split(".").pop() === checkboxName,
        );
        if (!matchingCheckbox) return null;
        return (
          <ControlledCheckbox
            name={matchingCheckbox.name}
            key={matchingCheckbox.name}
            label={matchingCheckbox.label}
            value={checkboxValue}
            onChange={(checked: CheckedOptional) => {
              field.setValue({ ...field.value(), [checkboxName]: checked });
              setCheckboxValues((prev) => ({
                ...prev,
                [checkboxName]: checked,
              }));
              if (noneValue && checked === "on") {
                setNoneValue("off");
              }
              field.validate();
            }}
          />
        );
      })}
      <input
        type="hidden"
        name={`${name}.__component`}
        value="form-elements.exclusive-checkbox"
      />
      <p className="ds-label-01-reg">oder</p>
      <ControlledCheckbox
        name={`${name}.none`}
        key={`${name}.none`}
        value={noneValue}
        onChange={(checked) => {
          const newFieldValues =
            checked === "on"
              ? Object.fromEntries(
                  Object.entries(field.value()).map(([key]) => [key, "off"]),
                )
              : field.value();
          field.setValue({ ...newFieldValues, none: checked });
          setNoneValue(checked);
          if (checked === "on") {
            setCheckboxValues((prev) =>
              Object.fromEntries(
                Object.entries(prev).map(([key]) => [key, "off"]),
              ),
            );
          }
          field.validate();
        }}
        label={
          checkboxes.find((c) => c.name === `${name}.none`)?.label ??
          "Nichts trifft zu"
        }
      />
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </div>
  );
};

function ControlledCheckbox({
  name,
  label,
  value,
  onChange,
}: Readonly<{
  name: string;
  label: string;
  value: CheckedOptional;
  onChange: (checked: CheckedOptional) => void;
}>) {
  const jsAvailable = useJsAvailable();
  /**
   * HTML Forms do not send unchecked checkboxes.
   * For server-side validation we need a same-named hidden field
   * For front-end validation, we need to hide that field if checkbox is checked
   */
  const showHiddenInput = !jsAvailable || value !== "on";
  return (
    <div className="flex items-center">
      {showHiddenInput && <input type="hidden" name={name} value={"off"} />}
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={value === "on"}
        value={jsAvailable ? value : "on"}
        className="ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]"
        onChange={(e) => onChange(e.target.checked ? "on" : "off")}
      />
      {label && (
        <label htmlFor={name}>
          <RichText html={label} />
        </label>
      )}
    </div>
  );
}

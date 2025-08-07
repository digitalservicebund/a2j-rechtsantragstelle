import { useField } from "@rvf/react-router";
import { useState } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
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
  const errorId = `${name}-error`;
  return (
    <div>
      {checkboxes
        .filter((c) => c.name !== `${name}.none`)
        .map((c) => {
          const subfieldName = c.name.split(".")[1];
          return (
            <ControlledCheckbox
              name={c.name}
              label={c.label}
              key={c.name}
              value={field.value()[subfieldName]}
              defaultValue={field.defaultValue()[subfieldName]}
              onChange={(checked) => {
                field.setValue({ ...field.value(), [subfieldName]: checked });
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
        value={field.value().none}
        defaultValue={field.defaultValue().none}
        onChange={(checked) => {
          if (checked === "on") {
            field.setValue({
              ...Object.fromEntries(
                Object.entries(field.value()).map(([key]) => [key, "off"]),
              ),
              none: checked,
            });
          } else {
            field.setValue({ ...field.value(), none: checked });
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
  defaultValue,
  onChange,
}: Readonly<{
  name: string;
  label: string;
  value: CheckedOptional;
  defaultValue: CheckedOptional;
  onChange: (checked: CheckedOptional) => void;
}>) {
  const [checked, setChecked] = useState<CheckedOptional>(value);
  // HTML Forms do not send unchecked checkboxes.
  // For server-side validation we need a same-named hidden field
  // For front-end validation, we need to hide that field if checkbox is checked
  const [renderHiddenField, setRenderHiddenField] = useState(
    defaultValue !== "on",
  );
  const jsAvailable = useJsAvailable();
  return (
    <div className="flex items-center">
      {(!jsAvailable || renderHiddenField) && (
        <input type="hidden" name={name} value={"off"} />
      )}
      <input
        type="checkbox"
        id={name}
        name={name}
        defaultChecked={defaultValue === "on"}
        value={jsAvailable ? checked : "on"}
        className="ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]"
        onChange={(e) => {
          setChecked(e.target.checked ? "on" : "off");
          setRenderHiddenField(!renderHiddenField);
          onChange(e.target.checked ? "on" : "off");
        }}
      />

      {label && (
        <label htmlFor={name}>
          <RichText html={label} />
        </label>
      )}
    </div>
  );
}

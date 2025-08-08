import { type FieldApi, useField } from "@rvf/react-router";
import { useState } from "react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type CheckboxValue } from "~/components/inputs/Checkbox";
import InputError from "~/components/inputs/InputError";
import RichText from "~/components/RichText";
import { type StrapiCheckboxComponent } from "~/services/cms/components/StrapiCheckbox";
import { type ExclusiveCheckboxes as ExclusiveCheckboxesType } from "~/services/validation/checkedCheckbox";

type ExclusiveCheckboxesProps = Readonly<{
  name: string;
  cmsCheckboxes: StrapiCheckboxComponent[];
}>;

export const ExclusiveCheckboxes = ({
  name,
  cmsCheckboxes,
}: ExclusiveCheckboxesProps) => {
  const field = useField<ExclusiveCheckboxesType>(name);
  const [noneCheckboxValue, setNoneCheckboxValue] = useState<CheckboxValue>(
    field.value().none,
  );
  const [checkboxes, setCheckboxes] = useState<
    Array<Omit<ControlledCheckboxProps, "onChange"> | undefined>
  >(
    Object.entries(field.value())
      .filter(([key]) => key !== "none")
      .map(([checkboxName, checkboxValue]) => {
        const matchingCmsCheckbox = cmsCheckboxes.find(
          (c) => c.name.split(".").pop() === checkboxName,
        );
        if (!matchingCmsCheckbox) return undefined;
        return {
          name: matchingCmsCheckbox.name,
          label: matchingCmsCheckbox.label,
          value: checkboxValue,
        };
      }),
  );
  const errorId = `${name}-error`;

  return (
    <div>
      {checkboxes.filter(Boolean).map((checkbox) => (
        <ControlledCheckbox
          {...checkbox!}
          key={checkbox?.name}
          onChange={onCheckboxChange(
            field,
            noneCheckboxValue,
            setNoneCheckboxValue,
            setCheckboxes,
          )}
        />
      ))}
      <p className="ds-label-01-reg">oder</p>
      <ControlledCheckbox
        name={`${name}.none`}
        key={`${name}.none`}
        value={noneCheckboxValue}
        onChange={onCheckboxChange(
          field,
          noneCheckboxValue,
          setNoneCheckboxValue,
          setCheckboxes,
        )}
        label={
          cmsCheckboxes.find((c) => c.name === `${name}.none`)?.label ??
          "Nichts trifft zu"
        }
      />
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </div>
  );
};

type ControlledCheckboxProps = {
  name: string;
  label: string;
  value: CheckboxValue;
  onChange: (name: string, checked: CheckboxValue) => void;
};

function ControlledCheckbox({
  name,
  label,
  value,
  onChange,
}: Readonly<ControlledCheckboxProps>) {
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
        onChange={(e) =>
          onChange(name.split(".").pop() ?? "", e.target.checked ? "on" : "off")
        }
      />
      {label && (
        <label htmlFor={name}>
          <RichText html={label} />
        </label>
      )}
    </div>
  );
}

const onCheckboxChange =
  (
    parentField: FieldApi<ExclusiveCheckboxesType>,
    noneCheckboxValue: CheckboxValue,
    setNoneCheckboxValue: React.Dispatch<React.SetStateAction<CheckboxValue>>,
    setCheckboxes: React.Dispatch<
      React.SetStateAction<
        Array<Omit<ControlledCheckboxProps, "onChange"> | undefined>
      >
    >,
  ) =>
  (checkboxName: string, checked: CheckboxValue) => {
    if (checkboxName === "none") {
      const newFieldValues =
        checked === "on"
          ? Object.fromEntries(
              Object.entries(parentField.value()).map(([key]) => [key, "off"]),
            )
          : parentField.value();
      parentField.setValue({ ...newFieldValues, none: checked });
      setNoneCheckboxValue(checked);
      if (checked === "on") {
        setCheckboxes((prev) => prev.map((c) => c && { ...c, value: "off" }));
      }
      parentField.validate();
    } else {
      parentField.setValue({ ...parentField.value(), [checkboxName]: checked });
      setCheckboxes((prev) =>
        prev.map((c) =>
          c?.name.split(".").pop() === checkboxName
            ? { ...c, value: checked }
            : c,
        ),
      );
      if (noneCheckboxValue && checked === "on") {
        setNoneCheckboxValue("off");
      }
      parentField.validate();
    }
  };

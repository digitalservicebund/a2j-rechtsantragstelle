import { type FieldApi, useField } from "@rvf/react-router";
import { useState } from "react";
import { type CheckboxValue } from "~/components/inputs/Checkbox";
import {
  type ControlledCheckboxProps,
  ControlledCheckbox,
} from "~/components/inputs/exclusiveCheckboxes/ControlledCheckbox";
import { fieldValuesToCheckboxProps } from "~/components/inputs/exclusiveCheckboxes/exclusiveCheckboxHelpers";
import InputError from "~/components/inputs/InputError";
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
    Array<Omit<ControlledCheckboxProps, "onChange">>
  >(fieldValuesToCheckboxProps(field, cmsCheckboxes, noneCheckboxValue));
  const errorId = `${name}-error`;

  return (
    <div>
      {checkboxes.filter(Boolean).map(({ name, ...checkbox }) =>
        name.split(".").pop() === "none" ? (
          <div key={name}>
            <p className="ds-label-01-reg">oder</p>
            <ControlledCheckbox
              name={name}
              {...checkbox}
              onChange={onCheckboxChange(
                field,
                noneCheckboxValue,
                setNoneCheckboxValue,
                setCheckboxes,
              )}
              value={noneCheckboxValue}
            />
          </div>
        ) : (
          <ControlledCheckbox
            name={name}
            key={name}
            onChange={onCheckboxChange(
              field,
              noneCheckboxValue,
              setNoneCheckboxValue,
              setCheckboxes,
            )}
            {...checkbox}
          />
        ),
      )}
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </div>
  );
};

/**
 * Checkbox change handler, handles both normal checkboxes and the special "none" checkbox
 * Curried for cleaner function call signature in the DOM
 */
const onCheckboxChange =
  (
    parentField: FieldApi<ExclusiveCheckboxesType>,
    noneCheckboxValue: CheckboxValue,
    setNoneCheckboxValue: React.Dispatch<React.SetStateAction<CheckboxValue>>,
    setCheckboxes: React.Dispatch<
      React.SetStateAction<Array<Omit<ControlledCheckboxProps, "onChange">>>
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

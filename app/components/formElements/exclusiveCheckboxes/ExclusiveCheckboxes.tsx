import { type FieldApi, useField } from "@rvf/react-router";
import { useState } from "react";
import { type ZodObject } from "zod";
import { type CheckboxValue } from "~/components/formElements/Checkbox";
import {
  ControlledCheckbox,
  type ControlledCheckboxProps,
} from "~/components/formElements/exclusiveCheckboxes/ControlledCheckbox";
import { fieldValuesToCheckboxProps } from "~/components/formElements/exclusiveCheckboxes/exclusiveCheckboxHelpers";
import InputError from "~/components/formElements/InputError";
import { type StrapiCheckboxComponent } from "~/services/cms/models/formElements/StrapiCheckbox";
import { type ExclusiveCheckboxes as ExclusiveCheckboxesType } from "~/services/validation/checkedCheckbox";

type ExclusiveCheckboxesProps = Readonly<{
  name: string;
  schema: ZodObject;
  cmsCheckboxes: StrapiCheckboxComponent[];
}>;

export const ExclusiveCheckboxes = ({
  name,
  schema,
  cmsCheckboxes,
}: ExclusiveCheckboxesProps) => {
  const field = useField<ExclusiveCheckboxesType | undefined>(name);
  const [noneCheckboxValue, setNoneCheckboxValue] = useState<CheckboxValue>(
    field.value()?.none ?? "off",
  );
  const [checkboxes, setCheckboxes] = useState<
    Array<Omit<ControlledCheckboxProps, "onChange">>
  >(
    fieldValuesToCheckboxProps(field, schema, cmsCheckboxes, noneCheckboxValue),
  );
  const errorId = `${name}-error`;
  const hasError = Boolean(field.error());

  return (
    <fieldset
      className="ds-stack ds-stack-24"
      aria-invalid={hasError}
      aria-describedby={hasError ? errorId : undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      {checkboxes.filter(Boolean).map(({ name, ...checkbox }) =>
        name.split(".").pop() === "none" ? (
          <div key={name}>
            <p className="ds-label-01-bold mb-24">oder</p>
            <ControlledCheckbox
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
          <ControlledCheckbox
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
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </fieldset>
  );
};

/**
 * Checkbox change handler, handles both normal checkboxes and the special "none" checkbox
 * Curried for cleaner function call signature in the DOM
 */
const onCheckboxChange =
  (
    parentField: FieldApi<ExclusiveCheckboxesType | undefined>,
    checkboxes: Array<Omit<ControlledCheckboxProps, "onChange">>,
    noneCheckboxValue: CheckboxValue,
    setNoneCheckboxValue: React.Dispatch<React.SetStateAction<CheckboxValue>>,
    setCheckboxes: React.Dispatch<
      React.SetStateAction<Array<Omit<ControlledCheckboxProps, "onChange">>>
    >,
  ) =>
  (checkboxName: string, checked: CheckboxValue) => {
    const existingParentValues =
      parentField.value() ??
      Object.fromEntries(checkboxes.map((c) => [c.name, c.value]));
    if (checkboxName === "none") {
      const newFieldValues =
        checked === "on"
          ? Object.fromEntries(
              Object.entries(existingParentValues).map(([key]) => [key, "off"]),
            )
          : parentField.value();
      parentField.setValue({ ...newFieldValues, none: checked });
      setNoneCheckboxValue(checked);
      if (checked === "on") {
        setCheckboxes((prev) => prev.map((c) => c && { ...c, value: "off" }));
      }
      parentField.validate();
    } else {
      parentField.setValue({
        ...existingParentValues,
        [checkboxName]: checked,
      } as ExclusiveCheckboxesType);
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

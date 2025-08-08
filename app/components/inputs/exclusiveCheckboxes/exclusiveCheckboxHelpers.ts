import { type FieldApi } from "@rvf/react-router";
import { type CheckboxValue } from "~/components/inputs/Checkbox";
import { type ControlledCheckboxProps } from "~/components/inputs/exclusiveCheckboxes/ControlledCheckbox";
import { type StrapiCheckboxComponent } from "~/services/cms/components/StrapiCheckbox";
import { type ExclusiveCheckboxes } from "~/services/validation/checkedCheckbox";

export function fieldValuesToCheckboxProps(
  field: FieldApi<ExclusiveCheckboxes>,
  cmsCheckboxes: StrapiCheckboxComponent[],
  noneCheckboxValue: CheckboxValue,
): Array<Omit<ControlledCheckboxProps, "onChange">> {
  return Object.entries(field.value()).map(([checkboxName, checkboxValue]) => {
    const matchingCmsCheckbox = cmsCheckboxes.find(
      (c) => c.name.split(".").pop() === checkboxName,
    );
    return {
      name: matchingCmsCheckbox?.name ?? "[Name not found]",
      label: matchingCmsCheckbox?.label ?? "[Label not found]",
      value: checkboxName === "none" ? noneCheckboxValue : checkboxValue,
    };
  });
}

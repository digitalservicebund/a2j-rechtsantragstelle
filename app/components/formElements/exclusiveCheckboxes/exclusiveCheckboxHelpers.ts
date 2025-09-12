import { type FieldApi } from "@rvf/react-router";
import { ZodEnum, type ZodObject } from "zod";
import { type CheckboxValue } from "~/components/formElements/Checkbox";
import { type ControlledCheckboxProps } from "~/components/formElements/exclusiveCheckboxes/ControlledCheckbox";
import { type StrapiCheckboxComponent } from "~/services/cms/models/formElements/StrapiCheckbox";
import { type ExclusiveCheckboxes } from "~/services/validation/checkedCheckbox";

export function fieldValuesToCheckboxProps(
  field: FieldApi<ExclusiveCheckboxes | undefined>,
  schema: ZodObject,
  noneCheckboxValue: CheckboxValue,
  cmsCheckboxes?: StrapiCheckboxComponent[],
): Array<Omit<ControlledCheckboxProps, "onChange">> {
  return Object.entries({
    ...schema.shape,
    ...field.value(),
  }).map(([checkboxName, checkboxValue]: [string, CheckboxValue | ZodEnum]) => {
    const matchingCmsCheckbox = cmsCheckboxes?.find(
      (c) => c.name.split(".").pop() === checkboxName,
    );
    const value = checkboxValue instanceof ZodEnum ? "off" : checkboxValue;
    return {
      name: matchingCmsCheckbox?.name ?? "[Name not found]",
      label: matchingCmsCheckbox?.label ?? "[Label not found]",
      value: checkboxName === "none" ? noneCheckboxValue : value,
    };
  });
}

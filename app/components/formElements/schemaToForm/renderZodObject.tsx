import type { z, ZodObject } from "zod";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import mapKeys from "lodash/mapKeys";
import { KernSchemaComponents } from "~/components/kernFormElements/KernSchemaComponents";
import { KernExclusiveCheckboxes } from "~/components/kern/formElements/exclusiveCheckboxes/KernExclusiveCheckboxes";
import KernSplitDateInput from "~/components/kern/formElements/input/KernSplitDateInput";

export const renderZodObject = (
  nestedSchema: ZodObject,
  fieldName: string,
  readOnlyFieldNames: string[],
  formComponents?: StrapiFormComponent[],
) => {
  if (nestedSchema.meta()?.description === "exclusive_checkbox") {
    const labels = Object.fromEntries(
      (formComponents ?? [])
        ?.filter((el) => el.__component === "form-elements.checkbox")
        .filter((el) => el.name.split(".")[0] === fieldName)
        .map((el) => [el.name.split(".").at(-1)!, el.label]),
    );

    return (
      <KernExclusiveCheckboxes
        key={fieldName}
        name={fieldName}
        options={Object.keys(nestedSchema.shape)}
        labels={labels}
      />
    );
  }
  if (nestedSchema.meta()?.description === "split_date") {
    return <KernSplitDateInput key={fieldName} name={fieldName} />;
  }
  // ZodObjects are multiple nested schemas, whos keys need to be prepended with the fieldname (e.g. "name.firstName")
  const innerSchema = mapKeys(
    nestedSchema.shape,
    (_, key) => `${fieldName}.${key}`,
  );
  return (
    <KernSchemaComponents
      key={fieldName}
      pageSchema={innerSchema}
      formComponents={formComponents}
      readOnlyFieldNames={readOnlyFieldNames}
    />
  );
};

export const isZodObject = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodObject => fieldSchema.def.type === "object";

import type { z, ZodObject } from "zod";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { ExclusiveCheckboxes } from "../exclusiveCheckboxes/ExclusiveCheckboxes";
import SplitDateInput from "../SplitDateInput";
import { SchemaComponents } from "../SchemaComponents";
import mapKeys from "lodash/mapKeys";

export const renderZodObject = (
  nestedSchema: ZodObject,
  fieldName: string,
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
      <ExclusiveCheckboxes
        key={fieldName}
        name={fieldName}
        options={Object.keys(nestedSchema.shape)}
        labels={labels}
      />
    );
  }
  if (nestedSchema.meta()?.description === "split_date") {
    return <SplitDateInput key={fieldName} name={fieldName} />;
  }
  // ZodObjects are multiple nested schemas, whos keys need to be prepended with the fieldname (e.g. "name.firstName")
  const innerSchema = mapKeys(
    nestedSchema.shape,
    (_, key) => `${fieldName}.${key}`,
  );
  return (
    <SchemaComponents
      key={fieldName}
      pageSchema={innerSchema}
      formComponents={formComponents}
    />
  );
};

export const isZodObject = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodObject => fieldSchema.def.type === "object";

import type { z, ZodObject } from "zod";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import mapKeys from "lodash/mapKeys";
import { SchemaComponents } from "~/components/formElements/SchemaComponents";
import { ExclusiveCheckboxes } from "../inputs/exclusiveCheckboxes/ExclusiveCheckboxes";
import SplitDateInput from "~/components/formElements/inputs/date/SplitDateInput";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import { SplitTimeInput } from "../inputs/time/SplitTimeInput";

const getContentData = (element?: StrapiFormComponent) => {
  const errorMessages =
    element && "errorMessages" in element ? element.errorMessages : undefined;

  const label = element && "label" in element ? element.label : undefined;
  const suffix = element && "suffix" in element ? element.suffix : undefined;
  const helperText =
    element && "helperText" in element ? element.helperText : undefined;

  return { errorMessages, label, suffix, helperText };
};

export const renderZodObject = (
  nestedSchema: ZodObject,
  fieldName: string,
  readOnlyFieldNames: string[],
  formComponents?: StrapiFormComponent[],
  dynamicOptions?: DynamicOptions,
) => {
  const matchingElement = formComponents
    ?.filter(
      (formComponents) =>
        formComponents.__component !== "form-elements.fieldset",
    )
    .find(({ name }) => name === fieldName);

  const { errorMessages, label, helperText, suffix } =
    getContentData(matchingElement);

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
    return (
      <SplitDateInput
        key={fieldName}
        name={fieldName}
        suffix={suffix}
        label={label}
        errorMessages={errorMessages}
      />
    );
  }

  if (nestedSchema.meta()?.description === "split_time") {
    return (
      <SplitTimeInput
        key={fieldName}
        name={fieldName}
        suffix={suffix}
        helperText={helperText}
        label={label}
        errorMessages={errorMessages}
      />
    );
  }
  // ZodObjects are multiple nested schemas, whos keys need to be prepended with the fieldname (e.g. "name.firstName")
  const innerSchema = mapKeys(
    nestedSchema.shape,
    (_, key) => `${fieldName}.${key}`,
  );
  return (
    <SchemaComponents
      key={fieldName}
      pageConfig={{ pageSchema: innerSchema }}
      formComponents={formComponents}
      readOnlyFieldNames={readOnlyFieldNames}
      dynamicOptions={dynamicOptions}
    />
  );
};

export const isZodObject = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodObject => fieldSchema.def.type === "object";

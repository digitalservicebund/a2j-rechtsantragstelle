import type { z, ZodObject } from "zod";
import { ExclusiveCheckboxes } from "~/components/inputs/ExclusiveCheckboxes";
import { type StrapiCheckboxComponent } from "~/services/cms/components/StrapiCheckbox";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export const isZodCustom = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodObject =>
  // TODO: find a better way to determine if a field is a custom component
  (fieldSchema as z.ZodObject).shape?.__component !== undefined;

export function renderZodCustom(
  schema: ZodObject,
  fieldName: string,
  formComponents?: StrapiFormComponent[],
) {
  if (schema.shape.__component.value === "form-elements.exclusive-checkbox") {
    return (
      <ExclusiveCheckboxes
        key={fieldName}
        name={fieldName}
        checkboxes={
          // Hidden input is needed from Strapi to prevent "none" option getting pruned
          formComponents?.filter(
            (c) => c.__component !== "form-elements.hidden-input",
          ) as StrapiCheckboxComponent[]
        }
      />
    );
  }
}

import { type SchemaObject } from "~/domains/userData";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

const getFieldsByFormElements = (
  formElements: StrapiFormComponent[],
): string[] =>
  formElements.flatMap((element) =>
    element.__component === "form-elements.fieldset"
      ? getFieldsByFormElements(element.fieldSetGroup.formComponents)
      : element.name,
  );

export const sortSchemaByFormComponents = (
  pageSchema: SchemaObject,
  formComponents?: StrapiFormComponent[],
) => {
  // if the page only has one field or there are no form components, return the schema as is
  if (Object.entries(pageSchema).length < 2 || !formComponents) {
    return pageSchema;
  }

  const fieldOrder = getFieldsByFormElements(formComponents);

  const orderIndex = new Map(fieldOrder.map((field, index) => [field, index]));

  const sortedEntries = Object.entries(pageSchema).sort(
    ([fieldA], [fieldB]) => {
      const indexA = orderIndex.get(fieldA);
      const indexB = orderIndex.get(fieldB);

      if (indexA === undefined && indexB === undefined) return 0;
      if (indexA === undefined) return 1;
      if (indexB === undefined) return -1;

      return indexA - indexB;
    },
  );

  return Object.fromEntries(sortedEntries);
};

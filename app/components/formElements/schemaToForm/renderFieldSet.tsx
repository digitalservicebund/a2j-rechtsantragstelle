import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import { Fieldset } from "../inputs/fieldset/Fieldset";
import { type SchemaObject } from "~/domains/userData";

export const getFieldSetByFieldName = (
  fieldName: string,
  formComponents: StrapiFormComponent[],
) => {
  return formComponents
    .filter(
      (formComponents) =>
        formComponents.__component === "form-elements.fieldset",
    )
    .find(({ fieldSetGroup: { formComponents } }) =>
      formComponents.some(({ name }) => name === fieldName),
    );
};

export const renderFieldSet = (
  fieldName: string,
  fieldSet: StrapiFieldSet,
  readOnlyFieldNames: string[],
  pageSchema: SchemaObject = {},
) => {
  const {
    fieldSetGroup: { formComponents },
    image,
    heading,
    id,
    helperText,
  } = fieldSet;

  // Avoid rendering the FieldSet if the fieldName is not the first field in the FieldSet
  if (
    formComponents
      .filter(({ name }) => pageSchema.hasOwnProperty(name))
      .findIndex(({ name }) => name === fieldName) > 0
  ) {
    return null;
  }

  return (
    <Fieldset
      key={id}
      formComponents={formComponents}
      heading={heading}
      image={image}
      helperText={helperText}
      readOnlyFieldNames={readOnlyFieldNames}
    />
  );
};

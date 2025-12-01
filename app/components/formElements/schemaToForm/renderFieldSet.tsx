import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import { FieldSetSchema } from "../FieldSet";

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

export const renderFieldSet = (fieldName: string, fieldSet: StrapiFieldSet) => {
  const {
    fieldSetGroup: { formComponents },
    image,
    heading,
    id,
  } = fieldSet;

  // Avoid rendering the FieldSet if the fieldName is not the first field in the FieldSet
  if (formComponents.findIndex(({ name }) => name === fieldName) > 0) {
    return null;
  }

  return (
    <FieldSetSchema
      key={id}
      formComponents={formComponents}
      heading={heading}
      image={image}
    />
  );
};

import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import { FieldSetSchema } from "../FieldSet";

const getFieldSetPageSchema = (
  pathname: string,
  formComponents: StrapiFieldSet["fieldSetGroup"]["formComponents"],
) => {
  const pageSchema = getPageSchema(pathname);

  return pageSchema
    ? Object.fromEntries(
        Object.entries(pageSchema).filter(([key]) =>
          formComponents.some((fc) => fc.name === key),
        ),
      )
    : null;
};

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
  // oxlint-disable-next-line rules-of-hooks
  const { pathname } = useLocation();

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

  const pageSchema = getFieldSetPageSchema(pathname, formComponents);

  if (!pageSchema) return null;

  return (
    <FieldSetSchema
      key={id}
      formComponents={formComponents}
      heading={heading}
      image={image}
      pageSchema={pageSchema}
    />
  );
};

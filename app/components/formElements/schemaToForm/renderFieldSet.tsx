import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { arrayIsNonEmpty } from "~/util/array";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import { FieldSetSchema } from "../FieldSet";

export const isFieldSetComponent = (
  fieldName: string,
  formComponents?: StrapiFormComponent[],
) => {
  if (!arrayIsNonEmpty(formComponents)) return false;

  return formComponents.some(
    (formComponents) =>
      formComponents.__component === "form-elements.fieldset" &&
      formComponents.fieldSetGroup.formComponents.some(
        ({ name }) => name === fieldName,
      ),
  );
};

const getFieldSetPageSchema = (
  pathname: string,
  { formComponents }: Pick<StrapiFieldSet["fieldSetGroup"], "formComponents">,
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

export const renderFieldSet = (
  fieldName: string,
  formComponents: StrapiFormComponent[],
) => {
  // oxlint-disable-next-line rules-of-hooks
  const { pathname } = useLocation();
  const fieldSetFormComponent = formComponents
    .filter(
      (formComponents) =>
        formComponents.__component === "form-elements.fieldset",
    )
    .find(({ fieldSetGroup }) =>
      fieldSetGroup.formComponents.some(
        ({ name }, index) => name === fieldName && index === 0,
      ),
    );

  if (!fieldSetFormComponent) return null;

  const { fieldSetGroup, image, heading, id } = fieldSetFormComponent;
  const pageSchema = getFieldSetPageSchema(pathname, fieldSetGroup);

  if (!pageSchema) return null;

  return (
    <FieldSetSchema
      key={id}
      fieldSetGroup={fieldSetGroup}
      heading={heading}
      image={image}
      pageSchema={pageSchema}
    />
  );
};

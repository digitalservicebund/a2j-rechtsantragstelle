import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { arrayIsNonEmpty } from "~/util/array";
import { useLocation } from "react-router";
import Image from "~/components/common/Image";
import RichText from "~/components/common/RichText";
import { SchemaComponents } from "../SchemaComponents";
import { getPageSchema } from "~/domains/pageSchemas";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import classNames from "classnames";

const IMAGE_HEIGHT = 24;
const IMAGE_WIDTH = 24;

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

  if (!pageSchema) return null;

  return Object.fromEntries(
    Object.entries(pageSchema).filter(([key]) =>
      formComponents.some((fc) => fc.name === key),
    ),
  );
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
    <fieldset key={id}>
      <legend className="md:flex md:gap-8">
        {image && (
          <Image
            {...image}
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
            ariaHidden={true}
          />
        )}
        <RichText html={heading} />
      </legend>

      <SchemaComponents
        pageSchema={pageSchema}
        formComponents={fieldSetGroup.formComponents}
        className={classNames("pt-16 !ds-stack-16", { "md:pl-32": image })}
        skipFieldSet
      />
    </fieldset>
  );
};

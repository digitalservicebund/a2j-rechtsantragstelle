import { type SchemaObject } from "~/domains/userData";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { getNestedSchema } from "../formElements/schemaToForm/getNestedSchema";
import {
  getFieldSetByFieldName,
  renderFieldSet,
} from "../formElements/schemaToForm/renderFieldSet";
import {
  isZodEnum,
  renderZodEnum,
} from "../formElements/schemaToForm/renderZodEnum";
import {
  isZodObject,
  renderZodObject,
} from "../formElements/schemaToForm/renderZodObject";
import {
  isZodString,
  renderZodString,
} from "../formElements/schemaToForm/renderZodString";
import { sortSchemaByFormComponents } from "../formElements/schemaToForm/sortSchemaByFormComponents";
import classNames from "classnames";
import {
  extractZodDescription,
  isSpecialComponentDescriptions,
  renderSpecialMetaDescriptions,
} from "~/components/formElements/schemaToForm/renderSchemaBasedFormElement";

type Props = {
  pageSchema: SchemaObject;
  formComponents?: StrapiFormComponent[];
  className?: string;
  readOnlyFieldNames: string[];
};

export const SchemaComponents = ({
  pageSchema,
  formComponents,
  className,
  readOnlyFieldNames,
}: Props) => {
  const sortedFieldsSchema = sortSchemaByFormComponents(
    pageSchema,
    formComponents,
  );

  return (
    <div
      className={classNames("flex flex-col gap-kern-space-x-large", className)}
    >
      {Object.entries(sortedFieldsSchema).map(([fieldName, fieldSchema]) => {
        const fieldSetGroup = getFieldSetByFieldName(
          fieldName,
          formComponents ?? [],
        );

        if (fieldSetGroup !== undefined) {
          return renderFieldSet(fieldName, fieldSetGroup, readOnlyFieldNames);
        }

        const matchingElement = formComponents
          ?.filter(
            (formComponents) =>
              formComponents.__component !== "form-elements.fieldset",
          )
          .find(({ name }) => name === fieldName);

        const description = extractZodDescription(fieldSchema);
        if (isSpecialComponentDescriptions(description)) {
          return renderSpecialMetaDescriptions(
            fieldName,
            description,
            matchingElement,
          );
        }

        const nestedSchema = getNestedSchema(fieldSchema);
        const isFieldReadOnly = readOnlyFieldNames.includes(fieldName);

        if (isZodObject(nestedSchema)) {
          return renderZodObject(
            nestedSchema,
            fieldName,
            readOnlyFieldNames,
            formComponents,
          );
        }

        if (isZodEnum(nestedSchema))
          return renderZodEnum(nestedSchema, fieldName, matchingElement);

        if (isZodString(nestedSchema))
          return renderZodString(fieldName, isFieldReadOnly, matchingElement);
      })}
    </div>
  );
};

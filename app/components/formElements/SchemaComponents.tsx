import {
  isZodString,
  renderZodString,
} from "~/components/formElements/schemaToForm/renderZodString";
import type { SchemaObject } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { getNestedSchema } from "./schemaToForm/getNestedSchema";
import { isZodEnum, renderZodEnum } from "./schemaToForm/renderZodEnum";
import { isZodObject, renderZodObject } from "./schemaToForm/renderZodObject";
import {
  getFieldSetByFieldName,
  renderFieldSet,
} from "./schemaToForm/renderFieldSet";
import classNames from "classnames";
import { sortSchemaByFormComponents } from "./schemaToForm/sortSchemaByFormComponents";
import {
  extractZodDescription,
  isSpecialComponentDescriptions,
  renderSchemaBasedFormElement,
} from "./schemaToForm/renderSchemaBasedFormElement";

type Props = {
  pageSchema: SchemaObject;
  formComponents?: StrapiFormComponent[];
  className?: string;
};

export const SchemaComponents = ({
  pageSchema,
  formComponents,
  className,
}: Props) => {
  const sortedFieldsSchema = sortSchemaByFormComponents(
    pageSchema,
    formComponents,
  );
  return (
    <div className={classNames("ds-stack ds-stack-40", className)}>
      {Object.entries(sortedFieldsSchema).map(([fieldName, fieldSchema]) => {
        const fieldSetGroup = getFieldSetByFieldName(
          fieldName,
          formComponents ?? [],
        );

        if (fieldSetGroup !== undefined) {
          return renderFieldSet(fieldName, fieldSetGroup);
        }

        const matchingElement = formComponents
          ?.filter(
            (formComponents) =>
              formComponents.__component !== "form-elements.fieldset",
          )
          .find(({ name }) => name === fieldName);

        const description = extractZodDescription(fieldSchema);
        if (isSpecialComponentDescriptions(description)) {
          return renderSchemaBasedFormElement(
            fieldName,
            description,
            matchingElement,
          );
        }

        const nestedSchema = getNestedSchema(fieldSchema);

        if (isZodObject(nestedSchema)) {
          return renderZodObject(nestedSchema, fieldName, formComponents);
        }

        if (isZodEnum(nestedSchema))
          return renderZodEnum(nestedSchema, fieldName, matchingElement);

        if (isZodString(nestedSchema))
          return renderZodString(fieldName, matchingElement);
      })}
    </div>
  );
};

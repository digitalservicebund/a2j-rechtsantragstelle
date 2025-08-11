import mapKeys from "lodash/mapKeys";
import type { SchemaObject } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { getNestedSchema } from "./schemaToForm/getNestedSchema";
import { isZodEnum, renderZodEnum } from "./schemaToForm/renderZodEnum";
import { isZodObject } from "./schemaToForm/renderZodObject";
import { isZodString, renderZodString } from "./schemaToForm/renderZodString";

type Props = {
  pageSchema: SchemaObject;
  formComponents?: StrapiFormComponent[];
};

export const SchemaComponents = ({ pageSchema, formComponents }: Props) => {
  return (
    <div className="ds-stack ds-stack-40">
      {Object.entries(pageSchema).map(([fieldName, fieldSchema]) => {
        const nestedSchema = getNestedSchema(fieldSchema);
        const matchingElement = formComponents
          ?.filter(
            (formComponents) =>
              // TODO - revisit this code later. For more details check this link https://github.com/digitalservicebund/a2j-rechtsantragstelle/pull/2309#discussion_r2200352159
              formComponents.__component !== "form-elements.fieldset",
          )
          .find((component) => {
            if (!("name" in component)) return false;
            const componentName = component.name;
            // Try exact match first
            if (componentName === fieldName) return true;
            // Try array prefix match (e.g., "einnahmen#beschreibung" matches "beschreibung")
            if (componentName.includes("#")) {
              const [, suffix] = componentName.split("#");
              return suffix === fieldName;
            }
            return false;
          });

        if (isZodObject(nestedSchema)) {
          // ZodObjects are multiple nested schemas, whos keys need to be prepended with the fieldname (e.g. "name.firstName")
          const innerSchema = mapKeys(
            nestedSchema.shape,
            (_, key) => `${fieldName}.${key}`,
          );
          return (
            <SchemaComponents
              key={matchingElement?.name ?? fieldName}
              pageSchema={innerSchema}
              formComponents={formComponents}
            />
          );
        }

        if (isZodEnum(nestedSchema))
          return renderZodEnum(
            nestedSchema,
            // matchingElement?.name ?? fieldName,
            fieldName,
            matchingElement,
          );

        if (isZodString(nestedSchema))
          return renderZodString(
            nestedSchema,
            // matchingElement?.name ?? fieldName,
            fieldName,
            matchingElement,
          );

        return null;
      })}
    </div>
  );
};

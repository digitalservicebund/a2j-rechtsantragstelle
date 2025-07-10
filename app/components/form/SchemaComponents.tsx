import mapKeys from "lodash/mapKeys";
import type { PageSchema } from "~/domains/pageSchemas";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { getNestedSchema } from "./schemaToForm/getNestedSchema";
import { isZodEnum, renderZodEnum } from "./schemaToForm/renderZodEnum";
import { isZodObject } from "./schemaToForm/renderZodObject";
import { isZodString, renderZodString } from "./schemaToForm/renderZodString";

type Props = {
  pageSchema: PageSchema;
  formComponents?: StrapiFormComponent[];
};

export const SchemaComponents = ({ pageSchema, formComponents }: Props) => (
  <div className="ds-stack ds-stack-40">
    {Object.entries(pageSchema).map(([fieldName, fieldSchema]) => {
      const nestedSchema = getNestedSchema(fieldSchema);
      const matchingElement = formComponents
        ?.filter(
          (formComponents) =>
            formComponents.__component !== "form-elements.fieldset", // TODO - revisit this code later
        )
        .find(({ name }) => name === fieldName);

      if (isZodObject(nestedSchema)) {
        // ZodObjects are multiple nested schemas, whos keys need to be prepended with the fieldname (e.g. "name.firstName")
        const innerSchema = mapKeys(
          nestedSchema.shape,
          (_, key) => `${fieldName}.${key}`,
        );
        return (
          <SchemaComponents
            key={fieldName}
            pageSchema={innerSchema}
            formComponents={formComponents}
          />
        );
      }

      if (isZodEnum(nestedSchema))
        return renderZodEnum(nestedSchema, fieldName, matchingElement);

      if (isZodString(nestedSchema))
        return renderZodString(nestedSchema, fieldName, matchingElement);
    })}
  </div>
);

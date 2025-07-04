import type { PageSchema } from "~/domains/pageSchemas";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { getNestedSchema } from "./schemaToForm/getNestedSchema";
import { isZodEnum, renderZodEnum } from "./schemaToForm/renderZodEnum";
import { isZodString, renderZodString } from "./schemaToForm/renderZodString";

type Props = {
  pageSchema: PageSchema;
  formElements?: StrapiFormComponent[];
};

export const SchemaComponents = ({ pageSchema, formElements }: Props) => {
  return (
    <div className="ds-stack ds-stack-40">
      {Object.entries(pageSchema).map(([fieldName, fieldSchema]) => {
        const nestedSchema = getNestedSchema(fieldSchema);
        const matchingElement = formElements?.find(
          ({ name }) => name === fieldName,
        );

        if (isZodEnum(nestedSchema))
          return renderZodEnum(nestedSchema, fieldName, matchingElement);

        if (isZodString(nestedSchema))
          return renderZodString(nestedSchema, fieldName, matchingElement);
      })}
    </div>
  );
};

import type { PageSchema } from "~/domains/pageConfig";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { schemaToFormElement } from "./schemaToForm";

export const PageFormComponents = ({
  pageSchema,
  formElements,
}: {
  pageSchema: PageSchema;
  formElements?: StrapiFormComponent[];
}) => {
  return (
    <div className="ds-stack ds-stack-40">
      {Object.entries(pageSchema).map(([fieldName, fieldSchema]) =>
        schemaToFormElement(fieldName, fieldSchema, formElements),
      )}
    </div>
  );
};

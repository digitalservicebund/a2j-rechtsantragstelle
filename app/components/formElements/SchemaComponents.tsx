import mapKeys from "lodash/mapKeys";
import { type z } from "zod";
import { ExclusiveCheckboxes } from "~/components/formElements/exclusiveCheckboxes/ExclusiveCheckboxes";
import FilesUpload from "~/components/formElements/filesUpload/FilesUpload";
import {
  isZodString,
  renderZodString,
} from "~/components/formElements/schemaToForm/renderZodString";
import type { SchemaObject } from "~/domains/userData";
import { type StrapiFilesUploadComponentSchema } from "~/services/cms/models/formElements/StrapiFilesUpload";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { filesUploadZodDescription } from "~/services/validation/pdfFileSchema";
import { getNestedSchema } from "./schemaToForm/getNestedSchema";
import { isZodEnum, renderZodEnum } from "./schemaToForm/renderZodEnum";
import { isZodObject } from "./schemaToForm/renderZodObject";
import SplitDateInput from "./SplitDateInput";

type Props = {
  pageSchema: SchemaObject;
  formComponents?: StrapiFormComponent[];
};

export const SchemaComponents = ({ pageSchema, formComponents }: Props) => (
  <div className="ds-stack ds-stack-40">
    {Object.entries(pageSchema).map(([fieldName, fieldSchema]) => {
      const nestedSchema = getNestedSchema(fieldSchema);
      const matchingElement = formComponents
        ?.filter(
          (formComponents) =>
            // TODO - revisit this code later. For more details check this link https://github.com/digitalservicebund/a2j-rechtsantragstelle/pull/2309#discussion_r2200352159
            formComponents.__component !== "form-elements.fieldset",
        )
        .find(({ name }) => name === fieldName);

      if (fieldSchema.meta()?.description === filesUploadZodDescription) {
        const filesUploadElement = matchingElement as z.infer<
          typeof StrapiFilesUploadComponentSchema
        >;
        return (
          <FilesUpload
            key={fieldName}
            name={fieldName}
            title={filesUploadElement.title}
            description={filesUploadElement.description}
            inlineNotices={filesUploadElement.inlineNotices}
            errorMessages={filesUploadElement.errorMessages}
          />
        );
      }

      if (isZodObject(nestedSchema)) {
        if (nestedSchema.meta()?.description === "exclusive_checkbox") {
          const labels = Object.fromEntries(
            (formComponents ?? [])
              ?.filter((el) => el.__component === "form-elements.checkbox")
              .filter((el) => el.name.split(".")[0] === fieldName)
              .map((el) => [el.name.split(".").at(-1)!, el.label]),
          );

          return (
            <ExclusiveCheckboxes
              key={fieldName}
              name={fieldName}
              options={Object.keys(nestedSchema.shape)}
              labels={labels}
            />
          );
        }
        if (nestedSchema.meta()?.description === "split_date") {
          return <SplitDateInput key={fieldName} name={fieldName} />;
        }
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

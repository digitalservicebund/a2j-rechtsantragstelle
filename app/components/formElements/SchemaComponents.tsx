import type { ZodType, z } from "zod";
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
import { isZodObject, renderZodObject } from "./schemaToForm/renderZodObject";
import { hiddenInputZodDescription } from "~/services/validation/hiddenInput";
import HiddenInput from "./HiddenInput";
import {
  isFieldSetComponent,
  renderFieldSet,
} from "./schemaToForm/renderFieldSet";
import classNames from "classnames";

type Props = {
  pageSchema: SchemaObject;
  formComponents?: StrapiFormComponent[];
  className?: string;
  skipFieldSet?: boolean;
};

const isZodSpecialMetaDescription = (fieldSchema: ZodType) => {
  return [filesUploadZodDescription, hiddenInputZodDescription].includes(
    fieldSchema.meta()?.description ?? "",
  );
};

const renderSpecialMetaDescriptions = (
  fieldName: string,
  fieldSchema: ZodType,
  matchingElement?: StrapiFormComponent,
) => {
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

  if (fieldSchema.meta()?.description === hiddenInputZodDescription) {
    return <HiddenInput key={fieldName} name={fieldName} />;
  }
};

export const SchemaComponents = ({
  pageSchema,
  formComponents,
  className,
  skipFieldSet = false,
}: Props) => (
  <div className={classNames("ds-stack ds-stack-40", className)}>
    {Object.entries(pageSchema).map(([fieldName, fieldSchema]) => {
      if (isFieldSetComponent(fieldName, formComponents) && !skipFieldSet) {
        return renderFieldSet(fieldName, formComponents!);
      }

      const matchingElement = formComponents
        ?.filter(
          (formComponents) =>
            formComponents.__component !== "form-elements.fieldset",
        )
        .find(({ name }) => name === fieldName);

      if (isZodSpecialMetaDescription(fieldSchema)) {
        return renderSpecialMetaDescriptions(
          fieldName,
          fieldSchema,
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

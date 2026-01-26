import { type z, type ZodType } from "zod";
import { type SchemaObject } from "~/domains/userData";
import { type StrapiFilesUploadComponentSchema } from "~/services/cms/models/formElements/StrapiFilesUpload";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { hiddenInputZodDescription } from "~/services/validation/hiddenInput";
import { filesUploadZodDescription } from "~/services/validation/pdfFileSchema";
import FilesUpload from "../formElements/filesUpload/FilesUpload";
import HiddenInput from "../formElements/HiddenInput";
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

type Props = {
  pageSchema: SchemaObject;
  formComponents?: StrapiFormComponent[];
  className?: string;
  showKernUX?: boolean;
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

export const KernSchemaComponents = ({
  pageSchema,
  formComponents,
  className,
  showKernUX = false,
}: Props) => {
  const sortedFieldsSchema = sortSchemaByFormComponents(
    pageSchema,
    formComponents,
  );

  return (
    <div className={`flex flex-col gap-kern-space-x-large ${className}`}>
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

        if (isZodSpecialMetaDescription(fieldSchema)) {
          return renderSpecialMetaDescriptions(
            fieldName,
            fieldSchema,
            matchingElement,
          );
        }

        const nestedSchema = getNestedSchema(fieldSchema);

        if (isZodObject(nestedSchema)) {
          return renderZodObject(
            nestedSchema,
            fieldName,
            formComponents,
            showKernUX,
          );
        }

        if (isZodEnum(nestedSchema))
          return renderZodEnum(nestedSchema, fieldName, matchingElement);

        if (isZodString(nestedSchema))
          return renderZodString(fieldName, matchingElement, showKernUX);
      })}
    </div>
  );
};

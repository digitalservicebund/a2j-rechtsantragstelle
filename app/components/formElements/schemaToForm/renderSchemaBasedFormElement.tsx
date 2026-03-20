import z from "zod";
import FilesUpload from "~/components/formElements/filesUpload/FilesUpload";
import HiddenInput from "~/components/formElements/HiddenInput";
import IbanInput from "~/components/formElements/IbanInput";
import { type StrapiFilesUploadComponentSchema } from "~/services/cms/models/formElements/StrapiFilesUpload";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { hiddenInputZodDescription } from "~/services/validation/hiddenInput";
import { ibanZodDescription } from "~/services/validation/iban";
import { filesUploadZodDescription } from "~/services/validation/pdfFileSchema";

const specialComponentDescriptions = [
  filesUploadZodDescription,
  hiddenInputZodDescription,
  ibanZodDescription,
] as const;

type SpecialComponentDescription =
  (typeof specialComponentDescriptions)[number];

export const extractZodDescription = (schema: z.ZodType) => {
  let nestedDescription: string | undefined;
  if (schema instanceof z.ZodUnion) {
    nestedDescription = schema.options
      .map((innerSchema) => (innerSchema as z.ZodType).description)
      .find(Boolean);
  }
  if (schema instanceof z.ZodPipe) {
    nestedDescription =
      (schema.out as z.ZodType).description ??
      (schema.in as z.ZodType).description;
  }
  return schema.description ?? nestedDescription;
};

export const isSpecialComponentDescriptions = (
  val?: any,
): val is SpecialComponentDescription =>
  specialComponentDescriptions.includes(val);

export const renderSchemaBasedFormElement = (
  fieldName: string,
  description: SpecialComponentDescription,
  matchingElement?: StrapiFormComponent,
) => {
  if (description === filesUploadZodDescription) {
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

  if (description === hiddenInputZodDescription) {
    return <HiddenInput key={fieldName} name={fieldName} />;
  }

  if (description === ibanZodDescription) {
    return <IbanInput key={fieldName} name={fieldName} {...matchingElement} />;
  }
};

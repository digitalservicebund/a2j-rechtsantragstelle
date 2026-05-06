import z from "zod";
import { type StrapiFilesUploadComponentSchema } from "~/services/cms/models/formElements/StrapiFilesUpload";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { hiddenInputZodDescription } from "~/services/validation/hiddenInput";
import { ibanZodDescription } from "~/services/validation/iban";
import { filesUploadZodDescription } from "~/services/validation/pdfFileSchema";
import { phoneNumberZodDescription } from "~/services/validation/phoneNumber";
import FilesUpload from "../inputs/filesUpload/FilesUpload";
import { mapLookValue } from "~/components/content/ContentComponents";
import HiddenInput from "../inputs/hidden/HiddenInput";
import IbanInput from "../inputs/iban/IbanInput";
import TelephoneInput from "../inputs/telephone/TelephoneInput";

const specialComponentDescriptions = [
  filesUploadZodDescription,
  hiddenInputZodDescription,
  ibanZodDescription,
  phoneNumberZodDescription,
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

export const renderSpecialMetaDescriptions = (
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
        inlineNotices={filesUploadElement.inlineNotices?.map(
          (inlineNotice) => ({
            ...inlineNotice,
            look: mapLookValue(inlineNotice.look),
          }),
        )}
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

  if (description === phoneNumberZodDescription) {
    return (
      <TelephoneInput key={fieldName} name={fieldName} {...matchingElement} />
    );
  }
};

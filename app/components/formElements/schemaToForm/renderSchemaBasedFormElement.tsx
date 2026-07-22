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
import { type ControlledFieldConfig } from "~/domains/pageSchemas";
import { numberIncrementZodDescription } from "~/services/validation/numberIncrement";
import NumberIncrement from "../inputs/number/NumberIncrement";
import {
  dynamicSelectZodDescription,
  type DynamicOptions,
} from "~/services/validation/dynamicSelect";
import Select from "../inputs/select/Select";
import { autoSuggestZodDescription } from "~/services/validation/autoSuggest";
import {
  type DataListType,
  type StrapiAutoSuggestComponent,
} from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import AutoSuggestInput from "~/components/formElements/inputs/autoSuggest/AutoSuggestInput";

const specialComponentDescriptions = [
  filesUploadZodDescription,
  hiddenInputZodDescription,
  ibanZodDescription,
  phoneNumberZodDescription,
  numberIncrementZodDescription,
  dynamicSelectZodDescription,
  autoSuggestZodDescription,
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
  fieldSchema: z.ZodType,
  controlledFieldConfig?: ControlledFieldConfig,
  matchingElement?: StrapiFormComponent,
  dynamicOptions?: DynamicOptions,
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
    return (
      <IbanInput
        key={fieldName}
        name={fieldName}
        controlledFieldConfig={controlledFieldConfig}
        {...matchingElement}
      />
    );
  }

  if (description === phoneNumberZodDescription) {
    return (
      <TelephoneInput key={fieldName} name={fieldName} {...matchingElement} />
    );
  }

  if (description === numberIncrementZodDescription) {
    const { minValue, maxValue } = getMinMaxValueByFieldSchema(fieldSchema);

    return (
      <NumberIncrement
        key={fieldName}
        name={fieldName}
        min={minValue}
        max={maxValue}
        {...matchingElement}
      />
    );
  }

  // MVP dynamic select implementation. Used currently only in Nachlass Erbfolge
  if (description === dynamicSelectZodDescription) {
    const options = dynamicOptions?.[fieldName] ?? [];
    const label =
      matchingElement && "label" in matchingElement
        ? matchingElement.label
        : undefined;
    const errorMessages =
      matchingElement && "errorMessages" in matchingElement
        ? matchingElement.errorMessages
        : undefined;

    return (
      <Select
        key={fieldName}
        name={fieldName}
        options={options}
        label={label}
        errorMessages={errorMessages}
      />
    );
  }

  if (description === autoSuggestZodDescription) {
    const autoSuggestElement = matchingElement as StrapiAutoSuggestComponent;
    const dataListType = fieldSchema.meta()?.type as DataListType;

    if (!dataListType) {
      throw new Error(
        `AutoSuggestInput field ${fieldName} is missing a dataList type in the Zod schema.`,
      );
    }

    return (
      <AutoSuggestInput
        {...autoSuggestElement}
        name={fieldName}
        dataList={dataListType}
        key={fieldName}
      />
    );
  }
};

function getMinMaxValueByFieldSchema(fieldSchema: z.ZodType) {
  if (!(fieldSchema instanceof z.ZodNumber)) {
    return { minValue: undefined, maxValue: undefined };
  }

  const minValue = fieldSchema.minValue ?? undefined;
  const maxValue = fieldSchema.maxValue ?? undefined;
  return { minValue, maxValue };
}

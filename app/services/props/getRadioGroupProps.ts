import { omitNull } from "~/util/omitNull";
import { RadioGroupPropsSchema } from "~/components/RadioGroup";
import type { StrapiSelect } from "~/services/cms/models/StrapiSelect";

export const getRadioGroupProps = (cmsData: StrapiSelect) => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );

  const props = {
    ...cmsData,
    errorMessages,
  };
  return RadioGroupPropsSchema.parse(omitNull(props));
};

import { omitNull } from "~/util/omitNull";
import { RadioGroupPropsSchema } from "~/components/RadioGroup";
import type { StrapiSelect } from "~/services/cms/models/StrapiSelect";

export const getRadioGroupProps = (cmsData: StrapiSelect) => {
  return RadioGroupPropsSchema.parse(omitNull(cmsData));
};

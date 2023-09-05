import type { StrapiInput } from "../cms/models/StrapiInput";
import type { InputProps } from "~/components/Input";
import { InputPropsSchema } from "~/components/Input";
import { omitNull } from "~/util/omitNull";

export const getInputProps = (cmsData: StrapiInput): InputProps => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );

  const props = {
    ...cmsData,
    width: cmsData.width?.replace("characters", ""),
    errorMessages,
  };

  return InputPropsSchema.parse(omitNull(props));
};

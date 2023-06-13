import type { StrapiInput } from "../cms/models/StrapiInput";
import type { InputProps } from "~/components/Input";
import { InputPropsSchema } from "~/components/Input";
import { omitNull } from "~/util/omitNull";

export const getInputProps = (cmsData: StrapiInput): InputProps => {
  const props = {
    ...cmsData,
    errors: cmsData.errors.data,
  };
  return InputPropsSchema.parse(omitNull(props));
};

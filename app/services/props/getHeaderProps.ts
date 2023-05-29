import { HeaderPropsSchema } from "~/components/Header";
import type { StrapiHeader } from "../cms/models/StrapiHeader";
import { omitNull } from "~/util/omitNull";

export const getHeaderProps = (cmsData: StrapiHeader) => {
  return HeaderPropsSchema.parse(omitNull(cmsData));
};

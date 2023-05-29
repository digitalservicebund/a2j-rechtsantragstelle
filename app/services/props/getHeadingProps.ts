import { HeadingPropsSchema } from "~/components/Heading";
import type { StrapiHeading } from "../cms/models/StrapiHeading";
import { omitNull } from "~/util/omitNull";

export const getHeadingProps = (cmsData: StrapiHeading) => {
  return HeadingPropsSchema.parse(omitNull(cmsData));
};

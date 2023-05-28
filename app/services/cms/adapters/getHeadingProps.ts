import { HeadingPropsSchema } from "~/components/Heading";
import type { Heading } from "../models/Heading";
import { omitNull } from "~/util/omitNull";

export const getHeadingProps = (cmsData: Heading) => {
  return HeadingPropsSchema.parse(omitNull(cmsData));
};

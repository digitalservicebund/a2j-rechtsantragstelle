import { HeadingPropsSchema } from "~/components/Heading";
import type { Heading } from "../models/Heading";
import { removeEmpty } from "~/util/removeEmpty";

export const getHeadingProps = (cmsData: Heading) => {
  return HeadingPropsSchema.parse(removeEmpty(cmsData));
};

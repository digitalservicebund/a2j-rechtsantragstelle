import { ParagraphPropsSchema } from "~/components/Paragraph";
import type { Paragraph } from "../models/Paragraph";
import { omitNull } from "~/util/omitNull";

export const getParagraphProps = (cmsData: Paragraph) => {
  return ParagraphPropsSchema.parse(omitNull(cmsData));
};

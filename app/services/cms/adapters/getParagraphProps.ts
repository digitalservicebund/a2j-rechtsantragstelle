import { ParagraphPropsSchema } from "~/components/Paragraph";
import type { Paragraph } from "../models/Paragraph";
import { removeEmpty } from "~/util/removeEmpty";

export const getParagraphProps = (cmsData: Paragraph) => {
  return ParagraphPropsSchema.parse(removeEmpty(cmsData));
};

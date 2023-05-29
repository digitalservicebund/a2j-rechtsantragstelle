import { ParagraphPropsSchema } from "~/components/Paragraph";
import type { StrapiParagraph } from "../cms/models/StrapiParagraph";
import { omitNull } from "~/util/omitNull";

export const getParagraphProps = (cmsData: StrapiParagraph) => {
  return ParagraphPropsSchema.parse(omitNull(cmsData));
};

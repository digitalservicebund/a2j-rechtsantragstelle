import { RichTextPropsSchema } from "~/components/RichText";
import type { StrapiParagraph } from "../cms/models/StrapiParagraph";
import { omitNull } from "~/util/omitNull";

export const getRichTextProps = (cmsData: StrapiParagraph) => {
  const props = {
    ...cmsData,
    markdown: cmsData.text,
  };
  return RichTextPropsSchema.parse(omitNull(props));
};

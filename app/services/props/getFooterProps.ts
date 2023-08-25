import { FooterPropsSchema } from "~/components/Footer";
import type { StrapiFooter } from "../cms/models/StrapiFooter";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";
import { getRichTextProps } from "./getRichTextProps";

export const getFooterProps = (cmsData: StrapiFooter) => {
  const props = {
    ...cmsData,
    paragraphs: cmsData.paragraphs?.map((p) => getRichTextProps(p)),
    image: getImageProps(cmsData.image),
  };
  return FooterPropsSchema.parse(omitNull(props));
};

import { FooterPropsSchema } from "~/components/Footer";
import type { StrapiFooter } from "../models/StrapiFooter";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";

export const getFooterProps = (cmsData: StrapiFooter) => {
  const props = {
    ...cmsData,
    image: getImageProps(cmsData.image),
  };
  return FooterPropsSchema.parse(omitNull(props));
};

import { FooterPropsSchema } from "~/components/Footer";
import type { Footer } from "../models/Footer";
import { removeEmpty } from "~/util/removeEmpty";
import { getImageProps } from "./getImageProps";

export const getFooterProps = (cmsData: Footer) => {
  const props = {
    ...cmsData,
    image: getImageProps(cmsData.image),
  };
  return FooterPropsSchema.parse(removeEmpty(props));
};

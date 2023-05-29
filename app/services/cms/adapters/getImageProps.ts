import { ImagePropsSchema } from "~/components/Image";
import { omitNull } from "~/util/omitNull";
import type { StrapiImage } from "../models/StrapiImage";

export const getImageProps = (cmsData: StrapiImage) => {
  if (!cmsData.data) return undefined;
  return ImagePropsSchema.parse(omitNull(cmsData.data.attributes));
};

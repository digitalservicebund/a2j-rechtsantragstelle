import { ImagePropsSchema } from "~/components/Image";
import { omitNull } from "~/util/omitNull";
import type { Image } from "../models/Image";

export const getImageProps = (cmsData: Image) => {
  if (!cmsData.data) return undefined;
  return ImagePropsSchema.parse(omitNull(cmsData.data.attributes));
};

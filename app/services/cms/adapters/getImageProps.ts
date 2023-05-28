import { ImagePropsSchema } from "~/components/Image";
import { removeEmpty } from "~/util/removeEmpty";
import type { Image } from "../models/Image";

export const getImageProps = (cmsData: Image) => {
  if (!cmsData.data) return undefined;
  return ImagePropsSchema.parse(removeEmpty(cmsData.data.attributes));
};

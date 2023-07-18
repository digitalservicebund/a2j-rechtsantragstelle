import { ImagePropsSchema } from "~/components/Image";
import { omitNull } from "~/util/omitNull";
import type { StrapiImage } from "../cms/models/StrapiImage";

export const getImageProps = (cmsData: StrapiImage | null | undefined) => {
  if (!cmsData?.data) return undefined;
  return ImagePropsSchema.parse(omitNull(cmsData.data.attributes));
};

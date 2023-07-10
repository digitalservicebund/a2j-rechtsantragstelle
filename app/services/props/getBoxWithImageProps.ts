import type { StrapiBoxWithImage } from "../cms/models/StrapiBoxWithImage";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";
import { BoxWithImagePropsSchema } from "~/components/BoxWithImage";

export const getBoxWithImageProps = (cmsData: StrapiBoxWithImage) => {
  const props = {
    ...cmsData,
    image: cmsData.image ? getImageProps(cmsData.image) : undefined,
  };
  return BoxWithImagePropsSchema.parse(omitNull(props));
};

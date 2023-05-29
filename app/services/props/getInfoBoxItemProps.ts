import { InfoBoxItemPropsSchema } from "~/components/InfoBoxItem";
import type { StrapiInfoBoxItem } from "../cms/models/StrapiInfoBoxItem";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";

export const getInfoBoxItemProps = (cmsData: StrapiInfoBoxItem) => {
  const props = {
    ...cmsData,
    image: cmsData.image ? getImageProps(cmsData.image) : undefined,
  };
  return InfoBoxItemPropsSchema.parse(omitNull(props));
};

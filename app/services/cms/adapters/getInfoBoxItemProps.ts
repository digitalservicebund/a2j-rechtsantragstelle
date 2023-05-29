import { InfoBoxItemPropsSchema } from "~/components/InfoBoxItem";
import type { StrapiInfoBoxItem } from "../models/StrapiInfoBoxItem";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";

export const getInfoBoxItemProps = (cmsData: StrapiInfoBoxItem) => {
  const props = {
    ...cmsData,
    image: cmsData.image ? getImageProps(cmsData.image) : undefined,
  };
  console.log({ cmsData, props });

  return InfoBoxItemPropsSchema.parse(omitNull(props));
};

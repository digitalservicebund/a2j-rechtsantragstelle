import { InfoBoxItemPropsSchema } from "~/components/InfoBoxItem";
import type { InfoBoxItem } from "../models/InfoBoxItem";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";

export const getInfoBoxItemProps = (cmsData: InfoBoxItem) => {
  const props = {
    ...cmsData,
    image: cmsData.image ? getImageProps(cmsData.image) : undefined,
  };
  console.log({ cmsData, props });

  return InfoBoxItemPropsSchema.parse(omitNull(props));
};

import { InfoBoxPropsSchema } from "~/components/InfoBox";
import type { InfoBox } from "../models/InfoBox";
import { omitNull } from "~/util/omitNull";
import { getInfoBoxItemProps } from "./getInfoBoxItemProps";

export const getInfoBoxProps = (cmsData: InfoBox) => {
  const props = {
    ...cmsData,
    items: cmsData.items.map(getInfoBoxItemProps),
  };
  console.log({ props: props.items });
  return InfoBoxPropsSchema.parse(omitNull(props));
};

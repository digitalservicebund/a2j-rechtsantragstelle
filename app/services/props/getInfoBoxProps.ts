import { InfoBoxPropsSchema } from "~/components/InfoBox";
import type { StrapiInfoBox } from "../cms/models/StrapiInfoBox";
import { omitNull } from "~/util/omitNull";
import { getInfoBoxItemProps } from "./getInfoBoxItemProps";

export const getInfoBoxProps = (cmsData: StrapiInfoBox) => {
  const props = {
    ...cmsData,
    items: cmsData.items.map(getInfoBoxItemProps),
  };
  console.log({ props: props.items });
  return InfoBoxPropsSchema.parse(omitNull(props));
};

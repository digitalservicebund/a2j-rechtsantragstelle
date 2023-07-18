import { InfoBoxItemPropsSchema } from "~/components/InfoBoxItem";
import type { StrapiInfoBoxItem } from "../cms/models/StrapiInfoBoxItem";
import { omitNull } from "~/util/omitNull";
import { getImageProps } from "./getImageProps";
import type { StrapiElementWithId } from "../cms/models/StrapiElementWithId";

export const getInfoBoxItemProps = (cmsData: StrapiInfoBoxItem) => {
  const props = { ...cmsData, image: getImageProps(cmsData.image) };
  return InfoBoxItemPropsSchema.parse(omitNull(props));
};

export function infoBoxesFromElementsWithID(
  elementsWithID: StrapiElementWithId[],
) {
  return elementsWithID.flatMap((elementWithID) =>
    elementWithID.element
      .filter((el) => el.__component === "page.info-box-item")
      .map((el) => getInfoBoxItemProps(el as StrapiInfoBoxItem)),
  );
}

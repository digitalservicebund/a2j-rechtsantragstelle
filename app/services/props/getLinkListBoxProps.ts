import { omitNull } from "~/util/omitNull";
import type { StrapiLinkListBox } from "../cms/models/StrapiLinkListBox";
import { StrapiLinkListBoxSchema } from "../cms/models/StrapiLinkListBox";

export const getLinkListBoxProps = (cmsData: StrapiLinkListBox) => {
  return StrapiLinkListBoxSchema.parse(
    omitNull({
      ...cmsData,
      button: cmsData.button ?? undefined,
    })
  );
};

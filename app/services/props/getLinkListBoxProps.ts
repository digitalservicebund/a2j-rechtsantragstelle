import { omitNull } from "~/util/omitNull";
import type { StrapiLinkListBox } from "../cms/models/StrapiLinkListBox";
import { LinkListBoxPropsSchema } from "~/components/LinkListBox";

export const getLinkListBoxProps = (cmsData: StrapiLinkListBox) => {
  return LinkListBoxPropsSchema.parse(omitNull(cmsData));
};

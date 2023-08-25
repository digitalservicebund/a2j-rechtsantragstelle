import { BoxPropsSchema } from "~/components/Box";
import type { StrapiBox } from "../cms/models/StrapiBox";
import { omitNull } from "~/util/omitNull";
import { getRichTextProps } from "./getRichTextProps";

export const getBoxProps = (cmsData: StrapiBox) => {
  const props = {
    ...cmsData,
    content: cmsData.content && getRichTextProps(cmsData.content),
  };
  return BoxPropsSchema.parse(omitNull(props));
};

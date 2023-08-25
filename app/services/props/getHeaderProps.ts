import { HeaderPropsSchema } from "~/components/Header";
import type { StrapiHeader } from "../cms/models/StrapiHeader";
import { omitNull } from "~/util/omitNull";
import { getRichTextProps } from "./getRichTextProps";

export const getHeaderProps = (cmsData: StrapiHeader) => {
  const props = {
    ...cmsData,
    content: cmsData.content && getRichTextProps(cmsData.content),
  };
  return HeaderPropsSchema.parse(omitNull(props));
};

import { HeaderPropsSchema } from "~/components/Header";
import type { Header } from "../models/Header";
import { removeEmpty } from "~/util/removeEmpty";

export const getHeaderProps = (cmsData: Header) => {
  return HeaderPropsSchema.parse(removeEmpty(cmsData));
};

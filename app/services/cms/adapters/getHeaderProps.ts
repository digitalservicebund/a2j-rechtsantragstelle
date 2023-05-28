import { HeaderPropsSchema } from "~/components/Header";
import type { Header } from "../models/Header";
import { omitNull } from "~/util/omitNull";

export const getHeaderProps = (cmsData: Header) => {
  return HeaderPropsSchema.parse(omitNull(cmsData));
};

import { BoxPropsSchema } from "~/components/Box";
import type { StrapiBox } from "../cms/models/StrapiBox";
import { omitNull } from "~/util/omitNull";

export const getBoxProps = (cmsData: StrapiBox) =>
  BoxPropsSchema.parse(omitNull(cmsData));

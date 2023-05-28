import { BoxPropsSchema } from "~/components/Box";
import type { StrapiBox } from "../models/StrapiBox";
import { removeEmpty } from "~/util/removeEmpty";

export const getBoxProps = (cmsData: StrapiBox) =>
  BoxPropsSchema.parse(removeEmpty(cmsData));

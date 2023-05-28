import { BoxPropsSchema } from "~/components/Box";
import type { Box } from "../models/Box";
import { removeEmpty } from "~/util/removeEmpty";

export const getBoxProps = (cmsData: Box) =>
  BoxPropsSchema.parse(removeEmpty(cmsData));

import { z } from "zod";
import { omitNull } from "~/util/omitNull";


const paddingOptions = ["auto", "0", "40", "80"] as const;

export const StrapiPaddingOptionalSchema = z
  .enum(paddingOptions)
  .nullable()
  .transform(omitNull)
  .optional();

import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const strapiPaddingOptions = ["auto", "0", "40", "80"] as const;

export const StrapiPaddingSchema = z.enum(strapiPaddingOptions);

export const StrapiPaddingOptionalSchema = z
  .enum(strapiPaddingOptions)
  .nullable()
  .transform(omitNull)
  .optional();

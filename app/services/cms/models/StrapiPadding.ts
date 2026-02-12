import { z } from "zod";
import type { Padding } from "~/components/layout/Container";
import { omitNull } from "~/util/omitNull";

export const strapiPaddingOptions = [
  "default",
  "px0",
  "px8",
  "px16",
  "px24",
  "px32",
  "px40",
  "px48",
  "px56",
  "px64",
] as const;

const strapiPaddingMap = {
  default: "default",
  px0: "0",
  px8: "8",
  px16: "16",
  px24: "24",
  px32: "32",
  px40: "40",
  px48: "48",
  px56: "56",
  px64: "64",
} as const satisfies Record<(typeof strapiPaddingOptions)[number], Padding>;

export const paddingOptions = ["default", "0", "40"] as const;

export const StrapiPaddingSchema = z
  .enum(strapiPaddingOptions)
  .transform((val) => strapiPaddingMap[val]);

export const StrapiPaddingOptionalSchema = z
  .enum(paddingOptions)
  .nullable()
  .transform(omitNull)
  .optional();

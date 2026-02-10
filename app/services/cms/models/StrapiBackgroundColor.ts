import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiBackgroundColorSchema = z.enum([
  "default",
  "white",
  "blue",
  "darkBlue",
  "yellow",
  "green",
  "red",
]);

export const StrapiKernBackgroundColorSchema = z.enum([
  "white",
  "grey300",
]);

export const StrapiKernBackgroundColorOptionalSchema = StrapiKernBackgroundColorSchema.nullable().transform(omitNull).optional();
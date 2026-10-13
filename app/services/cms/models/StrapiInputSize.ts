import z from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiSize = z
  .enum(["large", "medium", "small"])
  .nullable()
  .transform(omitNull).optional()
  .default("large");
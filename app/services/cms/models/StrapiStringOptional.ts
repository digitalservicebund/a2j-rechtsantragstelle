import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiStringOptionalSchema = z
  .string()
  .nullable()
  .transform(omitNull)
  .optional();

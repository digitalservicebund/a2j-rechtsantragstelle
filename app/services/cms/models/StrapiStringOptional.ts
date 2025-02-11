import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiStringOptional = z
  .string()
  .nullable()
  .transform(omitNull)
  .optional();

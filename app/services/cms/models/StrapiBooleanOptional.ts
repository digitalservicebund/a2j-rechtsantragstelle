import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiBooleanOptionalSchema = z
  .boolean()
  .nullable()
  .transform(omitNull)
  .optional();

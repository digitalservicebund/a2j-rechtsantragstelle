import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const strapiOptionalStringSchema = z
  .string()
  .nullable()
  .transform(omitNull);

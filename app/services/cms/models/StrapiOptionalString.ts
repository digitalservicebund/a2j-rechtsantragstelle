import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiOptionalStringSchema = z
  .string()
  .nullable()
  .transform(omitNull);

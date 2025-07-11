import { z } from "zod";
import { omitNull } from "~/util/omitNull";

export const StrapiOptionalIntegerSchema = z
  .number()
  .nullable()
  .transform(omitNull);

import { z } from "zod";
import { omitNull } from "~/util/omitNull";

const StrapiBackgroundColorSchema = z.enum(["white", "grey", "blue", "yellow"]);

export const StrapiBackgroundColorOptionalSchema =
  StrapiBackgroundColorSchema.nullable().transform(omitNull).optional();

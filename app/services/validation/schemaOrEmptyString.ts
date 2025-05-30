import { z, type ZodEffects, type ZodString, type ZodTypeAny } from "zod";

export const schemaOrEmptyString = (
  schema: ZodEffects<ZodTypeAny> | ZodString,
) => schema.optional().or(z.literal(""));

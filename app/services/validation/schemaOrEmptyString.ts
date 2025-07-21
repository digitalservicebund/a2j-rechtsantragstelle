import { z, type ZodEffects, type ZodString, type ZodType } from "zod";

export const schemaOrEmptyString = (schema: ZodEffects<ZodType> | ZodString) =>
  schema.optional().or(z.literal(""));

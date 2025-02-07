import { z, type ZodEffects, type ZodString, type ZodTypeAny } from "zod";

export const optionalOrSchema = (
  schema: ZodEffects<ZodTypeAny> | ZodString,
  optionalSchema: ZodTypeAny = z.string().trim().max(0),
) => {
  return schema.optional().or(optionalSchema); //either optional or proper schema,
};

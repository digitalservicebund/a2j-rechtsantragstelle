import { z, type ZodEffects, type ZodString, type ZodTypeAny } from "zod";

export const optionalOrSchema = (
  schema: ZodEffects<ZodTypeAny> | ZodString,
) => {
  return schema.or(z.string().trim().max(0)); //either optional or proper schema,
};

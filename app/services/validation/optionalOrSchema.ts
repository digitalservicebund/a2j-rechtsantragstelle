import { z, type ZodEffects, type ZodString } from "zod";

export const optionalOrSchema = (schema: ZodEffects<any> | ZodString) => {
  return schema.or(z.string().trim().max(0)); //either optional or proper schema,
};

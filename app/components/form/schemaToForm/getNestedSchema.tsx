import type { z } from "zod";
import type { ZodEnum } from "./renderZodEnum";

export const getNestedSchema = (
  schema: z.ZodTypeAny,
): ZodEnum | z.ZodString => {
  return schema._def.typeName === "ZodEffects"
    ? getNestedSchema(schema._def.schema)
    : (schema as ZodEnum | z.ZodString);
};

import type { z } from "zod";
import type { ZodEnum } from "./renderZodEnum";

export const getNestedSchema = (
  schema: z.ZodTypeAny,
): ZodEnum | z.ZodString => {
  switch (schema._def.typeName) {
    case "ZodEffects":
      return getNestedSchema(schema._def.schema);
    case "ZodOptional":
      return getNestedSchema(schema._def.innerType);
    default:
      return schema as ZodEnum | z.ZodString;
  }
};

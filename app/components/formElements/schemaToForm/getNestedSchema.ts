import { type z } from "zod";

export const getNestedSchema = <T extends z.ZodType>(
  schema: T | z.ZodNullable<T> | z.ZodOptional<T>,
): T => {
  if ("in" in schema) return getNestedSchema(schema.in as T);
  if ("unwrap" in schema) return getNestedSchema(schema.unwrap());
  return schema;
};

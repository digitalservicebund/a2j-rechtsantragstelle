import { type z } from "zod";

const isZodUnion = (schema: z.ZodType): schema is z.ZodUnion =>
  "options" in schema.def;

export const getNestedSchema = <T extends z.ZodType>(
  schema:
    | T
    | z.ZodNullable<T>
    | z.ZodOptional<T>
    | z.ZodUnion<readonly [T, ...z.ZodType[]]>,
): T => {
  if ("in" in schema) return getNestedSchema(schema.in as T);
  if ("unwrap" in schema) return getNestedSchema(schema.unwrap());
  if (isZodUnion(schema)) return getNestedSchema(schema.options[0]); // Unions can theoretically contain many different schemas. For now: pick first one
  return schema;
};

import type { z } from "zod";

export const getNestedSchema = <T extends z.ZodType>(
  schema: T | z.ZodNullable<T> | z.ZodOptional<T> | z.ZodPipe<T>,
): T => ("in" in schema ? getNestedSchema(schema.in) : (schema as T));

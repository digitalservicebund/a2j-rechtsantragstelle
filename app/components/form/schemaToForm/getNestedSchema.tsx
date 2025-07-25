import type { z } from "zod";
import type { ZodEnum } from "./renderZodEnum";

export const getNestedSchema = (
  schema: z.ZodType,
): ZodEnum | z.ZodString | z.ZodObject =>
  "in" in schema
    ? getNestedSchema(schema.in as z.ZodType)
    : (schema as ZodEnum | z.ZodString | z.ZodObject);

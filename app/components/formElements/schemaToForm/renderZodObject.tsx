import type { z } from "zod";

export const isZodObject = (
  fieldSchema: z.ZodType,
): fieldSchema is z.ZodObject => fieldSchema.def.type === "object";

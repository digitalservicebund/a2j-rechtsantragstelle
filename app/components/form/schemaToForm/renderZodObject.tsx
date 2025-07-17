import type { z } from "zod";

export const isZodObject = (
  fieldSchema: z.ZodTypeAny,
): fieldSchema is z.ZodObject => fieldSchema.def.type === "object";

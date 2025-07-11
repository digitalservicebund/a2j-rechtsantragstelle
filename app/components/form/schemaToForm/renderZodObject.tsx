import type { z } from "zod";

export const isZodObject = (
  fieldSchema: z.ZodTypeAny,
): fieldSchema is z.SomeZodObject => fieldSchema._def.typeName === "ZodObject";

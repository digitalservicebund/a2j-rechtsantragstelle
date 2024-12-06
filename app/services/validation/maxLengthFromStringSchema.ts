import { z } from "zod";

export const maxLengthFromStringSchema = (
  schema: z.ZodSchema | undefined,
): number | undefined => {
  if (schema instanceof z.ZodOptional) {
    return maxLengthFromStringSchema(schema.unwrap());
  }

  if (schema instanceof z.ZodString) {
    return schema._def.checks.find((check) => check.kind === "max")?.value;
  }
};

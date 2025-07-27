import { z, type ZodTypeAny } from "zod";

export const schemaOrEmptyString = <T extends ZodTypeAny>(schema: T) =>
  z.literal("").or(schema);

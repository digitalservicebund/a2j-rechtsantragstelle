import { z, type ZodType } from "zod";

export const schemaOrEmptyString = <T extends ZodType>(schema: T) =>
  schema.or(z.literal(""));

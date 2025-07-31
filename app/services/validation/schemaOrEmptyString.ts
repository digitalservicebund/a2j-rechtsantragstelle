import { z, type ZodType } from "zod";

export const schemaOrEmptyString = <T extends ZodType>(schema: T) =>
  z.literal("").or(schema);

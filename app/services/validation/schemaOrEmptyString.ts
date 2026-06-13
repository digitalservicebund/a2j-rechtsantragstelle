import { z, type ZodType } from "zod";

export const schemaOrEmptyString = <T extends ZodType>(schema: T) =>
  schema.or(z.literal(""));

export const schemaOrEmptyStringOptional = <T extends ZodType>(schema: T) =>
  z.union([z.literal("").optional(), schema]);

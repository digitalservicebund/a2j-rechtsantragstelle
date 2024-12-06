import { z } from "zod";
import { TEXTAREA_CHAR_LIMIT } from "./inputlimits";

export const stringOptionalSchema = z
  .string()
  .trim()
  .max(TEXTAREA_CHAR_LIMIT, { message: "max" })
  .optional();

export const stringOptionalSchemaWithMaxLength = (maxLength: number) =>
  z.string().trim().max(maxLength, { message: "max" }).optional();

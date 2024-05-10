import { z } from "zod";
import { TEXTAREA_CHAR_LIMIT } from "./inputlimits";

export const stringRequiredSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .max(TEXTAREA_CHAR_LIMIT, { message: "max" });

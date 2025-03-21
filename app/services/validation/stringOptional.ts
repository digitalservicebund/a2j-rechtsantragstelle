import { z } from "zod";
import { TEXTAREA_CHAR_LIMIT } from "./inputlimits";

export const stringOptionalSchema = z
  .string()
  //processing the string before validation.
  .transform((string) => {
    // remove possible whitespaces
    return string.trim();
  })
  // using refine instead of max() to show validation message according to the string length
  .refine(
    (string) =>
      // using replace to remove newlines
      string.replace(/\r\n|\r|\n/g, "").length <= TEXTAREA_CHAR_LIMIT,
    { message: "max" },
  )
  .optional();

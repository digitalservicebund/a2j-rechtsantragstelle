import { z } from "zod";

export const integerSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine((numString) => /^-?(\d+|\d{1,3}(\.\d{3})+)$/.test(numString), {
    message: "invalidInteger",
  })
  .transform((numString) => Number(numString.replace(/\./g, "")));

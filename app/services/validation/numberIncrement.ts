import { z } from "zod";

export const createNumberIncrementSchema = (min: number = 0, max?: number) => {
  return z.coerce
    .string()
    .trim()
    .min(1, { message: "required" })
    .transform(Number)
    .refine((val) => val >= min, { message: "too_low" })
    .refine((val) => !max || val <= max, { message: "too_high" });
};

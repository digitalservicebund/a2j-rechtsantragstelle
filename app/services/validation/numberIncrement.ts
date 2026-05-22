import { z } from "zod";

export const numberIncrementZodDescription = "number_increment";

export const createNumberIncrementSchema = (min: number = 0, max?: number) => {
  return z.coerce
    .number()
    .min(min, { message: "too_low" })
    .max(max ?? Number.MAX_SAFE_INTEGER, { message: "too_high" })
    .meta({ description: numberIncrementZodDescription });
};

import { z } from "zod";

export const integerSchema = z.coerce
  .number({
    message: "invalidNumber",
  })
  .refine((number) => number !== 0, {
    message: "required",
  })
  .refine((number) => Number.isInteger(number), {
    message: "invalidInteger",
  });

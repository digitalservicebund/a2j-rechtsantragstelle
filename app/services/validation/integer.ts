import { z } from "zod";

export const integerSchema = z.coerce
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine((numString) => /^[\d.,]*$/.test(numString), {
    message: "invalidNumber",
  })
  .refine(
    (numString) => /^-?(\d+|\d{1,3}(\.\d{3})+)(,(\s)?\d*)?$/.test(numString),
    {
      message: "invalidInteger",
    },
  )
  .transform((numString) =>
    Math.round(Number(numString.replaceAll(".", "").replace(",", "."))),
  );

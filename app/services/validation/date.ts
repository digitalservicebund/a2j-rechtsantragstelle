import { z } from "zod";
import isDate from "validator/lib/isDate";

export const dateSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine(
    (date) =>
      isDate(date, {
        format: "DD.MM.YYYY",
        strictMode: true,
        delimiters: ["."],
      }),
    { message: "invalid" },
  );

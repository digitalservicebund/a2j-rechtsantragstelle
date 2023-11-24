import { z } from "zod";
import isDate from "validator/lib/isDate";

export const dateSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .length(10, { message: "invalid" }) // obsolete once this is merged: https://github.com/validatorjs/validator.js/pull/2056
  .refine(
    (date) =>
      isDate(date, {
        format: "DD.MM.YYYY",
        strictMode: true,
        delimiters: ["."],
      }),
    { message: "invalid" },
  );

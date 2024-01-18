import { z } from "zod";
import isTime from "validator/lib/isTime";

export const timeSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine((time) => /^\d\d:\d\d$/.test(time), { message: "format" })
  .refine(
    (time) =>
      isTime(time, {
        hourFormat: "hour24",
      }),
    { message: "invalid" },
  );

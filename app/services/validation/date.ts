import isDate from "validator/lib/isDate";
import { z } from "zod";
import { dateUTCFromGermanDateString } from "~/util/date";

const isValidDate = (date: string) =>
  isDate(date, {
    format: "DD.MM.YYYY",
    strictMode: true,
    delimiters: ["."],
  });

export const createDateSchema = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  if (args?.earliest && args?.latest && args.latest() <= args.earliest())
    throw Error(
      `Latest valid ${args.latest().toDateString()} can't be before earliest valid ${args.earliest().toDateString()}`,
    );

  return z
    .string()
    .trim()
    .min(1, { message: "required" })
    .superRefine((date, ctx) => {
      if (!/^\d\d\.\d\d\.\d\d\d\d$/.test(date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "format",
          fatal: true,
        });
        return z.NEVER; // abort early, see https://zod.dev/?id=abort-early
      }
    })
    .refine(isValidDate, { message: "invalid" })
    .superRefine((dateString, ctx) => {
      const date = dateUTCFromGermanDateString(dateString);
      if (args?.earliest && date < args.earliest()) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "too_early",
        });
      }
      if (args?.latest && date > args.latest()) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "too_late",
        });
      }
      return dateString;
    });
};

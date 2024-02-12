import { z } from "zod";
import isDate from "validator/lib/isDate";

function dateUTCFromGermanDateString(date: string) {
  const [day, month, year] = date.split(".");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function today() {
  const today = new Date();
  return new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
}

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

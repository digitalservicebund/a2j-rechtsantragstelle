import isDate from "validator/lib/isDate";
import { z } from "zod";
import { dateUTCFromGermanDateString, today } from "~/util/date";

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
    .check((ctx) => {
      if (!/^\d\d\.\d\d\.\d\d\d\d$/.test(ctx.value)) {
        ctx.issues.push({
          code: "custom",
          message: "format",
          fatal: true,
          input: ctx.value,
          continue: false,
        });
      }
    })
    .refine(isValidDate, { message: "invalid" })
    .check((ctx) => {
      const date = dateUTCFromGermanDateString(ctx.value);
      if (args?.earliest && date < args.earliest()) {
        ctx.issues.push({
          code: "custom",
          message: "too_early",
          input: ctx.value,
        });
      }
      if (args?.latest && date > args.latest()) {
        ctx.issues.push({
          code: "custom",
          message: "too_late",
          input: ctx.value,
        });
      }
    });
};
export const createSplitDateSchema = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  if (args?.earliest && args?.latest && args.latest() <= args.earliest()) {
    throw Error(
      `Latest valid ${args.latest().toDateString()} can't be before earliest valid ${args.earliest().toDateString()}`,
    );
  }
  const toDateString = (day: number, month: number, year: number) =>
    `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;

  return z
    .object({
      tag: z.coerce
        .number({ message: "required" })
        .min(1, { message: "required" })
        .max(31, { message: "day_out_of_range" }),
      monat: z.coerce
        .number({ message: "required" })
        .min(1, { message: "required" })
        .max(12, { message: "month_out_of_range" }),
      jahr: z.coerce
        .number({ message: "required" })
        .min(1900, { message: "required" })
        .max(today().getFullYear(), { message: "year_out_of_range" }),
    })
    .refine(
      (data) => isValidDate(toDateString(data.tag, data.monat, data.jahr)),
      { message: "invalid_date_format" },
    )
    .meta({ description: "split_date" });
};

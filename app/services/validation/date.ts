import isDate from "validator/lib/isDate";
import { z } from "zod";
import { addYears, dateUTCFromGermanDateString, today } from "~/util/date";

export const MINUS_4_YEARS = -4;
export const MINUS_24_YEARS = -24;
export const MINUS_150_YEARS = -150;

const isValidDate = (date: string) =>
  isDate(date, {
    format: "DD.MM.YYYY",
    strictMode: true,
    delimiters: ["."],
  });
export const toDateString = (day?: number, month?: number, year?: number) =>
  `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;

type SplitDate =
  | { day: string; month: string; year: string }
  | { day: number; month: number; year: number };

export const toDateStringFromSplitDate = (value: SplitDate | "" | undefined) => {
  if (value && typeof value === "object") {
    const { day, month, year } = value as {
      day: string | number;
      month: string | number;
      year: string | number;
    };
    return toDateString(
      Number(day),
      Number(month),
      typeof year === "string" ? Number(year) : year,
    );
  }

  return "";
};

export const createDateSchema = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  if (args?.earliest && args?.latest && args.latest() <= args.earliest())
    throw new Error(
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
    throw new Error(
      `Latest valid ${args.latest().toDateString()} can't be before earliest valid ${args.earliest().toDateString()}`,
    );
  }
  const FIRST_DAY = 1;
  const LAST_DAY = 31;
  const FIRST_MONTH = 1;
  const LAST_MONTH = 12;
  const FIRST_YEAR = 1900;

  const input_invalid = "Bitte geben Sie ein gültiges Geburtsdatum ein.";
  const input_required = "Diese Felder müssen ausgefüllt werden.";

  return z
    .object({
      day: z
        .string({ message: input_required })
        .trim()
        .min(1, input_required)
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && num >= FIRST_DAY && num <= LAST_DAY;
          },
          { message: input_invalid },
        ),
      month: z
        .string({ message: input_required })
        .trim()
        .min(1, input_required)
        .refine(
          (val) => {
            const num = Number(val);
            return (
              !Number.isNaN(num) && num >= FIRST_MONTH && num <= LAST_MONTH
            );
          },
          { message: input_invalid },
        ),
      year: z
        .string({ message: input_required })
        .trim()
        .min(1, input_required)
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num);
          },
          { message: input_invalid },
        )
        .refine((val) => Number(val) >= FIRST_YEAR, {
          message: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
        })
        .refine((val) => Number(val) <= Number(new Date().getFullYear()), {
          message: "Geburtsdatum muss in der Vergangenheit liegen.",
        }),
    })
    .superRefine((data, ctx) => {
      const dateString = toDateString(
        Number(data.day),
        Number(data.month),
        Number(data.year),
      );
      if (!isValidDate(dateString)) {
        ctx.addIssue({
          code: "custom",
          message: input_invalid,
          path: ["year"],
        });
        return;
      }
      const date = dateUTCFromGermanDateString(dateString);
      if (args?.earliest && date < args.earliest()) {
        ctx.addIssue({
          code: "custom",
          message: "too_early",
          path: ["year"],
        });
      }
      if (args?.latest && date > args.latest()) {
        ctx.addIssue({
          code: "custom",
          message: "too_late",
          path: ["year"],
        });
      }
    })
    .meta({ description: "split_date" });
};

export const childBirthdaySchema = createDateSchema({
  earliest: () => addYears(today(), -24),
  latest: () => today(),
});

import isDate from "validator/lib/isDate";
import { z } from "zod";
import { dateUTCFromGermanDateString } from "~/util/date";

const isValidDate = (date: string) =>
  isDate(date, {
    format: "DD.MM.YYYY",
    strictMode: true,
    delimiters: ["."],
  });
export const toDateString = (day?: number, month?: number, year?: number) =>
  `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;

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

  return z
    .object({
      day: z.coerce
        .number({ message: "Bitte geben Sie ein gültiges Geburtsdatum ein." })
        .refine((val) => val >= 0, {
          message: "Bitte geben Sie ein gültiges Geburtsdatum ein.",
        })
        .min(1, { message: "Diese Felder müssen ausgefüllt werden." })
        .max(31, { message: "Bitte geben Sie ein gültiges Geburtsdatum ein." }),
      month: z.coerce
        .number({ message: "Bitte geben Sie ein gültiges Geburtsdatum ein." })
        .refine((val) => val >= 0, {
          message: "Bitte geben Sie ein gültiges Geburtsdatum ein.",
        })
        .min(1, { message: "Diese Felder müssen ausgefüllt werden." })
        .max(12, { message: "Bitte geben Sie ein gültiges Geburtsdatum ein." }),
      year: z.preprocess(
        (val) => {
          if (!val) {
            return undefined;
          }
          return val;
        },
        z.coerce
          .number({ message: "Diese Felder müssen ausgefüllt werden." })
          .min(1900, {
            message: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
          })
          .max(new Date().getFullYear(), {
            message: "Geburtsdatum muss in der Vergangenheit liegen.",
          }),
      ),
    })
    .superRefine((data, ctx) => {
      if (!isValidDate(toDateString(data.day, data.month, data.year))) {
        ctx.addIssue({
          code: "custom",
          message: "Bitte geben Sie ein gültiges Geburtsdatum ein.",
          path: ["geburtsdatum"],
          fatal: false,
        });
      }
    })
    .meta({ description: "split_date" });
};

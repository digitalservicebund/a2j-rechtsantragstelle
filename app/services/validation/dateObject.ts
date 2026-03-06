import z from "zod";
import { isValidDate } from "./dateString";

const input_required = "Diese Felder müssen ausgefüllt werden.";
const requiredString = z.string().trim().min(1, input_required);

export const createSplitDateSchema = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  if (args?.earliest && args?.latest && args.latest() <= args.earliest()) {
    throw new Error(
      `Latest valid ${args.latest().toDateString()} can't be before earliest valid ${args.earliest().toDateString()}`,
    );
  }

  return z
    .object({
      day: requiredString
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && num >= 1 && num <= 31;
          },
          { error: "Ungültiger Tag" },
        )
        .transform((val) => val.padStart(2, "0")),
      month: requiredString
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && num >= 1 && num <= 12;
          },
          { error: "Ungültiger Monat" },
        )
        .transform((val) => val.padStart(2, "0")),

      year: requiredString.refine((val) => !Number.isNaN(Number(val)), {
        error: "Ungültiges Jahr",
      }),
    })
    .meta({ description: "split_date" })
    .refine((dateObj) => isValidDate(toDateString(dateObj)), {
      error: "Ungültiges Datum",
    })
    .check((ctx) => {
      const date = toDate(ctx.value);
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

type DateObject = { day: string; month: string; year: string };

export const toDateString = (date: DateObject) =>
  `${date.day}.${date.month}.${date.year}`;

export const toDate = (date: DateObject) =>
  new Date(
    Date.UTC(Number(date.year), Number(date.month) - 1, Number(date.day)),
  );

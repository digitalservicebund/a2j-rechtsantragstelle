import z from "zod";
import { isValidDate } from "./dateString";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { addYears, today } from "~/util/date";
import { stringOptionalSchema } from "./stringOptional";

const input_required = "Diese Felder müssen ausgefüllt werden.";
const requiredString = z.string().trim().min(1, input_required);

export const dateInputZodDescription = "date_input";
export const dateInputOptionalZodDescription = "date_input_optional";

// treats a missing field the same as an empty one, since zod can call .refine with either
const isBlank = (val?: string): val is undefined | "" =>
  !val || val.length === 0;

const assertValidDateRangeArgs = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  if (args?.earliest && args?.latest && args.latest() <= args.earliest()) {
    throw new Error(
      `Latest valid ${args.latest().toDateString()} can't be before earliest valid ${args.earliest().toDateString()}`,
    );
  }
};

export const createSplitDateSchema = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  assertValidDateRangeArgs(args);

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

      year: requiredString.refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num > 0;
        },
        {
          error: "Ungültiges Jahr",
        },
      ),
    })
    .meta({ description: dateInputZodDescription })
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

// skips the range check while a field is blank; "Ungültiger ..." errors already cover malformed values
const optionalDatePartRefine =
  (predicate: (num: number) => boolean) => (val?: string) => {
    if (isBlank(val)) {
      return true;
    }

    const num = Number(val);
    return !Number.isNaN(num) && predicate(num);
  };

const padIfPresent = (val?: string) =>
  isBlank(val) ? val : val.padStart(2, "0");

export const createSplitDateSchemaOptional = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  assertValidDateRangeArgs(args);

  return z
    .object({
      day: stringOptionalSchema
        .refine(
          optionalDatePartRefine((num) => num >= 1 && num <= 31),
          {
            error: "Ungültiger Tag",
          },
        )
        .transform(padIfPresent),
      month: stringOptionalSchema
        .refine(
          optionalDatePartRefine((num) => num >= 1 && num <= 12),
          {
            error: "Ungültiger Monat",
          },
        )
        .transform(padIfPresent),
      year: stringOptionalSchema.refine(
        optionalDatePartRefine((num) => num > 0),
        { error: "Ungültiges Jahr" },
      ),
    })
    .meta({ description: dateInputOptionalZodDescription })
    .refine(
      (dateObj) => {
        if (dateObj === undefined) {
          return true;
        }

        const { day, month, year } = dateObj;
        if (isBlank(day) && isBlank(month) && isBlank(year)) {
          return true;
        }
        if (isBlank(day) || isBlank(month) || isBlank(year)) {
          return false;
        }

        return isValidDate(toDateString({ day, month, year }));
      },
      {
        error: "Ungültiges Datum",
      },
    )
    .check((ctx) => {
      if (!objectKeysNonEmpty(ctx.value, ["day", "month", "year"])) {
        return;
      }

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

export type DateObject = { day: string; month: string; year: string };

export const toDateString = (date: DateObject) =>
  `${date.day}.${date.month}.${date.year}`;

export const toDate = (date: DateObject) =>
  new Date(
    Date.UTC(Number(date.year), Number(date.month) - 1, Number(date.day)),
  );

export const toDateObject = (date: Date): DateObject => {
  const month = date.getUTCMonth() + 1;
  return {
    day: date.getUTCDate().toString().padStart(2, "0"),
    month: month.toString().padStart(2, "0"),
    year: date.getUTCFullYear().toString(),
  };
};

export const hasDateObject = (date: Partial<DateObject> | undefined) => {
  return objectKeysNonEmpty(date, ["day", "month", "year"]);
};

export const childBirthdaySchema = createSplitDateSchema({
  earliest: () => addYears(today(), -24),
  latest: () => today(),
});

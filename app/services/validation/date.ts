import isDate from "validator/lib/isDate";
import { z } from "zod";
import { dateUTCFromGermanDateString } from "~/util/date";

const isValidDate = (date: string) =>
  isDate(date, {
    format: "DD.MM.YYYY",
    strictMode: true,
    delimiters: ["."],
  });

const validateDay = (day: string, ctx: z.RefinementCtx) => {
  if (!/^\d+$/.test(day)) {
    ctx.addIssue({
      code: "custom",
      message: "invalid_day_format",
      path: ["geburtsdatumTag"],
    });
    return null;
  }

  const num = Number(day);

  if (num < 1 || num > 31) {
    ctx.addIssue({
      code: "custom",
      message: "day_out_of_range",
      path: ["geburtsdatumTag"],
    });
    return null;
  }
  return num;
};

const validateMonth = (month: string, ctx: z.RefinementCtx) => {
  if (!/^\d+$/.test(month)) {
    ctx.addIssue({
      code: "custom",
      message: "invalid_month_format",
      path: ["geburtsdatumMonat"],
    });
    return null;
  }

  const num = Number(month);

  if (num < 1 || num > 12) {
    ctx.addIssue({
      code: "custom",
      message: "month_out_of_range",
      path: ["geburtsdatumMonat"],
    });
    return null;
  }
  return num;
};

const validateYear = (year: string, ctx: z.RefinementCtx) => {
  if (!/^\d{4}$/.test(year)) {
    ctx.addIssue({
      code: "custom",
      message: "invalid_year_format",
      path: ["geburtsdatumJahr"],
    });
    return null;
  }

  const num = Number(year);
  const currentYear = new Date().getFullYear();

  if (num < 1900 || num > currentYear) {
    ctx.addIssue({
      code: "custom",
      message: "year_out_of_range",
      path: ["geburtsdatumJahr"],
    });
    return null;
  }
  return num;
};

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
      geburtsdatumTag: z.string().min(1, { message: "required" }),
      geburtsdatumMonat: z.string().min(1, { message: "required" }),
      geburtsdatumJahr: z.string().min(1, { message: "required" }),
    })
    .superRefine((data, ctx) => {
      const { geburtsdatumTag, geburtsdatumMonat, geburtsdatumJahr } = data;

      const day = validateDay(geburtsdatumTag, ctx);
      const month = validateMonth(geburtsdatumMonat, ctx);
      const year = validateYear(geburtsdatumJahr, ctx);

      if (ctx.issues.length > 0) return;

      const dateString = `${day?.toString().padStart(2, "0")}.${month?.toString().padStart(2, "0")}.${year?.toString().padStart(4, "0")}`;

      if (!isValidDate(dateString)) {
        ctx.addIssue({
          code: "custom",
          message: "invalid",
          path: ["geburtsdatum"],
        });
        return;
      }

      const date = dateUTCFromGermanDateString(dateString);

      if (args?.earliest && date < args.earliest()) {
        ctx.addIssue({
          code: "custom",
          message: "too_early",
          path: ["geburtsdatum"],
        });
      }

      if (args?.latest && date > args.latest()) {
        ctx.addIssue({
          code: "custom",
          message: "too_late",
          path: ["geburtsdatum"],
        });
      }
    });
};

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

      const tag = Number(geburtsdatumTag);
      const monat = Number(geburtsdatumMonat);
      const jahr = Number(geburtsdatumJahr);

      if (tag < 1 || tag > 31) {
        ctx.addIssue({
          code: "custom",
          message: "day_out_of_range",
          path: ["geburtsdatumTag"],
        });
      }

      if (!/^\d+$/.test(geburtsdatumTag) || tag < 1 || tag > 31) {
        ctx.addIssue({
          code: "custom",
          message: "day_out_of_range",
          path: ["geburtsdatumTag"],
        });
      }

      if (!/^\d+$/.test(geburtsdatumMonat) || monat < 1 || monat > 12) {
        ctx.addIssue({
          code: "custom",
          message: "month_out_of_range",
          path: ["geburtsdatumMonat"],
        });
      }
      if (
        !/^\d{4}$/.test(geburtsdatumJahr) ||
        jahr < 1900 ||
        jahr > new Date().getFullYear()
      ) {
        ctx.addIssue({
          code: "custom",
          message: "year_out_of_range",
          path: ["geburtsdatumJahr"],
        });
      }

      if (ctx.issues.length > 0) return;

      const dateString = `${geburtsdatumTag.padStart(2, "0")}.${geburtsdatumMonat.padStart(2, "0")}.${geburtsdatumJahr}`;

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

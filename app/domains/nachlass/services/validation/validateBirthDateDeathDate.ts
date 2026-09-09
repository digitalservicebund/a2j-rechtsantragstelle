import { z } from "zod";
import { type SchemaObject } from "~/domains/userData";
import { translations } from "~/services/translations/translations";
import { type DateObject, toDate } from "~/services/validation/dateObject";

export function validateBirthDate(
  birthDateFieldName: string,
  deathDateFieldName: string,
) {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const geburtsdatum = ctx.value[birthDateFieldName] as DateObject;
      const sterbedatum = ctx.value[deathDateFieldName] as
        DateObject | undefined;

      if (sterbedatum && toDate(geburtsdatum) > toDate(sterbedatum)) {
        ctx.issues.push({
          code: "custom",
          message: translations.nachlass.birthDateAfterDeathDateError.de,
          path: [birthDateFieldName],
          fatal: true,
          input: ctx.value[birthDateFieldName],
        });
      }

      return z.NEVER;
    });
  };
}

export function validateDeathDate(
  birthDateFieldName: string,
  deathDateFieldName: string,
) {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const sterbedatum = ctx.value[deathDateFieldName] as DateObject;
      const geburtsdatum = ctx.value[birthDateFieldName] as
        DateObject | undefined;

      if (geburtsdatum && toDate(sterbedatum) < toDate(geburtsdatum)) {
        ctx.issues.push({
          code: "custom",
          message: translations.nachlass.deathDateBeforeBirthDateError.de,
          path: [deathDateFieldName],
          fatal: true,
          input: ctx.value[deathDateFieldName],
        });
      }

      return z.NEVER;
    });
  };
}

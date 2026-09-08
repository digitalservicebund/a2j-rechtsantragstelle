import { z } from "zod";
import { type SchemaObject } from "~/domains/userData";
import { translations } from "~/services/translations/translations";
import { type DateObject, toDate } from "~/services/validation/dateObject";

export function validateBirthDateBeforeDeathDate(
  birthDateFieldName: string,
  deathDateFieldName: string,
) {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const sterbedatum = ctx.value[deathDateFieldName] as
        DateObject | undefined;
      const geburtsdatum = toDate(ctx.value[birthDateFieldName] as DateObject);
      if (sterbedatum && geburtsdatum > toDate(sterbedatum)) {
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
export function validateDeathDateAfterBirthDate(
  birthDateFieldName: string,
  deathDateFieldName: string,
) {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const geburtsdatum = ctx.value[birthDateFieldName] as
        DateObject | undefined;
      const sterbedatum = toDate(ctx.value[deathDateFieldName] as DateObject);
      if (geburtsdatum && toDate(geburtsdatum) > sterbedatum) {
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

import { z } from "zod";
import { type SchemaObject } from "~/domains/userData";
import { translations } from "~/services/translations/translations";
import { type DateObject, toDate } from "~/services/validation/dateObject";

export function validateBirthDateDeathDate(
  birthDateFieldName: string,
  deathDateFieldName: string,
  type: "birthDate" | "deathDate",
) {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const sterbedatum = ctx.value[deathDateFieldName] as
        DateObject | undefined;
      const geburtsdatum = ctx.value[birthDateFieldName] as
        DateObject | undefined;

      if (
        type === "birthDate" &&
        geburtsdatum &&
        sterbedatum &&
        toDate(geburtsdatum) > toDate(sterbedatum)
      ) {
        ctx.issues.push({
          code: "custom",
          message: translations.nachlass.birthDateAfterDeathDateError.de,
          path: [birthDateFieldName],
          fatal: true,
          input: ctx.value[birthDateFieldName],
        });
      } else if (
        type === "deathDate" &&
        geburtsdatum &&
        sterbedatum &&
        toDate(geburtsdatum) > toDate(sterbedatum)
      ) {
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

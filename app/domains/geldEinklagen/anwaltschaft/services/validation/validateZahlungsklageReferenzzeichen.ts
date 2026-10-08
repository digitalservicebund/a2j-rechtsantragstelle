import { z } from "zod";
import { geldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type FunctionMultiFieldsValidation } from "~/domains/types";
import { type SchemaObject } from "~/domains/userData";
import { translations } from "~/services/translations/translations";

const _schema = geldEinklagenAnwaltschaftPages.klageInhalt.pageSchema;

export function validateZahlungsklageReferenzzeichen(): FunctionMultiFieldsValidation<
  Pick<typeof _schema, "zahlungsklageBezeichnung" | "zahlungsklageNummer">
> {
  return function (baseSchema: z.ZodObject<SchemaObject>) {
    return baseSchema.check((ctx) => {
      const bezeichnung = ctx.value["zahlungsklageBezeichnung"] as
        string | undefined;
      const nummer = ctx.value["zahlungsklageNummer"] as string | undefined;

      if ((bezeichnung && !nummer) || (!bezeichnung && nummer)) {
        ctx.issues.push(
          {
            code: "custom",
            message:
              translations.geldEinklagenAnwaltschaft
                .zahlungsklageReferenzzeichenError.de,
            path: ["zahlungsklageBezeichnung"],
            fatal: true,
            input: ctx.value["zahlungsklageBezeichnung"],
          },
          {
            code: "custom",
            message:
              translations.geldEinklagenAnwaltschaft
                .zahlungsklageReferenzzeichenError.de,
            path: ["zahlungsklageNummer"],
            fatal: true,
            input: ctx.value["zahlungsklageNummer"],
          },
        );
      }

      return z.NEVER;
    });
  };
}

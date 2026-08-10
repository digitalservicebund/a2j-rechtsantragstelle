import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { geldEinklagenKlageErstellenPages } from "../../formular/klage-erstellen/pages";

const _schema =
  geldEinklagenKlageErstellenPages
    .begruendungBeschreibungAbschnitteBeweisPersonAuswahl.pageSchema;

export function validatePersonenAuswahl(
  baseSchema: MultiFieldsValidationBaseSchema<
    Pick<
      typeof _schema,
      | "abschnitte#hasPersonenAsBeklagte"
      | "abschnitte#hasPersonenAsKlagende"
      | "abschnitte#personen#personAuswahl"
    >
  >,
) {
  return baseSchema.check((ctx) => {
    const personAuswahl = ctx.value["abschnitte#personen#personAuswahl"];

    if (personAuswahl === "anotherPerson") {
      return;
    }

    if (
      personAuswahl === "beklagte" &&
      ctx.value["abschnitte#hasPersonenAsBeklagte"] === "true"
    ) {
      ctx.issues.push({
        code: "custom",
        message: "beklagtePersonAlreadyExists",
        path: ["abschnitte#personen#personAuswahl"],
        fatal: true,
        input: ctx.value["abschnitte#personen#personAuswahl"],
      });
    }

    if (
      personAuswahl === "klagende" &&
      ctx.value["abschnitte#hasPersonenAsKlagende"] === "true"
    ) {
      ctx.issues.push({
        code: "custom",
        message: "klagendePersonAlreadyExists",
        path: ["abschnitte#personen#personAuswahl"],
        fatal: true,
        input: ctx.value["abschnitte#personen#personAuswahl"],
      });
    }

    return z.NEVER;
  });
}

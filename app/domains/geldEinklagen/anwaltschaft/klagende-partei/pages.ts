import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";

const natuerlichePersonenArray = z.array(
  z.object({
    // beschreibung: stringRequiredMaxSchema({ max: 12000 }).check(datatypeC),
    // personIdAsBeklagte: personIdOnAbschnittSchema,
    // personIdAsKlagende: personIdOnAbschnittSchema,
    // dokumenten: beweiseDokumentenArray.optional(),
    // personen: beweisePersonenArray.optional(),
    // reuseBeweiseDokument: schemaOrEmptyStringOptional(
    //   reuseBeweisSchema("document"),
    // ),
    // reuseBeweisePerson: schemaOrEmptyStringOptional(
    //   reuseBeweisSchema("person"),
    // ),
  }),
);

export const klagendeParteiPages = {
  klagendeUebersicht: {
    stepId: "/klagende-partei/klagende/uebersicht",
    arraySummary: {
      name: "natuerlichePersonen",
      schema: natuerlichePersonenArray,
      isArrayRelevant: () => true,
    },
  },
} as const satisfies PagesConfig;

export type KlagendeParteiPages = typeof klagendeParteiPages;

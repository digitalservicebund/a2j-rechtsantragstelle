import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularGesetzlicheVertretungPages = {
  gesetzlicheVertretungFrage: {
    stepId: "gesetzliche-vertretung/frage",
    pageSchema: {
      hasGesetzlicheVertretung: YesNoAnswer,
    },
  },
  gesetzlicheVertretungDaten: {
    stepId: "gesetzliche-vertretung/daten",
    pageSchema: {
      gesetzlicheVertretungDaten: z.object({
        vorname: stringRequiredSchema,
        nachname: stringRequiredSchema,
        strasseHausnummer: stringRequiredSchema,
        plz: stringRequiredSchema.pipe(postcodeSchema),
        ort: stringRequiredSchema,
        telefonnummer: stringOptionalSchema,
      }),
    },
  },
} as const satisfies PagesConfig;

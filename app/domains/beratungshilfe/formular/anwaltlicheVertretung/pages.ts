import { type PagesConfig } from "~/domains/pageSchemas";
import { createDateSchema } from "~/services/validation/date";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const berHAntragAnwaltlicheVertretungPages = {
  anwaltskanzlei: {
    stepId: "anwaltliche-vertretung/start",
    pageSchema: {
      anwaltskanzlei: YesNoAnswer,
    },
  },
  beratungStattgefunden: {
    stepId: "anwaltliche-vertretung/beratung-stattgefunden",
    pageSchema: {
      beratungStattgefunden: YesNoAnswer,
    },
  },
  beratungStattgefundenDatum: {
    stepId: "anwaltliche-vertretung/beratung-stattgefunden-datum",
    pageSchema: {
      beratungStattgefundenDatum: createDateSchema(),
    },
  },
  fristHinweis: {
    stepId: "anwaltliche-vertretung/frist-hinweis",
  },
  anwaltKontaktdaten: {
    stepId: "anwaltliche-vertretung/anwalt-kontaktdaten",
    pageSchema: {
      anwaltName: stringRequiredSchema,
    },
  },
  anwaltStrasseUndHausnummer: {
    stepId: "anwaltliche-vertretung/anwalt-strasse-und-hausnummer",
    pageSchema: {
      anwaltStrasseUndHausnummer: stringRequiredSchema,
    },
  },
  anwaltPlz: {
    stepId: "anwaltliche-vertretung/anwalt-plz",
    pageSchema: {
      anwaltPlz: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  anwaltOrt: {
    stepId: "anwaltliche-vertretung/anwalt-ort",
    pageSchema: {
      anwaltOrt: stringRequiredSchema,
    },
  },
  anwaltEnde: {
    stepId: "anwaltliche-vertretung/anwalt-ende",
  },
} as const satisfies PagesConfig;

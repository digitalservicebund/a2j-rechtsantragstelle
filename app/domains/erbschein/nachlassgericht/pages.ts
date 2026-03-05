import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const erbscheinNachlassgerichtPages = {
  start: {
    stepId: "start",
  },
  lebensmittelpunkt: {
    stepId: "lebensmittelpunkt",
    pageSchema: {
      lebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  auslaendischerErbfall: {
    stepId: "ergebnis/auslaendische-erbfaelle",
  },
  wohnsituationPflegeheim: {
    stepId: "wohnsituation-pflegeheim",
    pageSchema: {
      wohnsituationPflegeheim: YesNoAnswer,
    },
  },
  wohnsituationHospiz: {
    stepId: "wohnsituation-hospiz",
    pageSchema: {
      wohnsituationHospiz: YesNoAnswer,
    },
  },
  plzPflegeheim: {
    stepId: "plz-pflegeheim",
    pageSchema: {
      plzPflegeheim: postcodeSchema,
    },
  },
  plzHospiz: {
    stepId: "plz-hospiz",
    pageSchema: {
      plzHospiz: postcodeSchema,
    },
  },
  plzLebensmittelpunkt: {
    stepId: "plz-lebensmittelpunkt",
    pageSchema: {
      plzLebensmittelpunkt: postcodeSchema,
    },
  },
  strasseHausnummer: {
    stepId: "strasse-hausnummer",
    pageSchema: {
      strasse: stringRequiredSchema,
      houseNumber: germanHouseNumberSchema,
    },
  },
  nachlassgerichtErgebnis: {
    stepId: "ergebnis/nachlassgericht",
  },
} as const satisfies PagesConfig;

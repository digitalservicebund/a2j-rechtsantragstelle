import { z } from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestSchema } from "~/services/validation/autoSuggest";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const nachlassErbausschlagungGerichtFindenPages = {
  start: {
    stepId: "start",
  },
  lebensmittelpunkt: {
    stepId: "lebensmittelpunkt",
    pageSchema: {
      lebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  plz: {
    stepId: "plz",
    pageSchema: {
      plz: postcodeSchema,
    },
  },
  strasseHausnummer: {
    stepId: "verschiedene-zustaendige-gerichte",
    pageSchema: {
      strasse: autoSuggestSchema("streetNames"),
      hausnummer: germanHouseNumberSchema,
    },
  },
  ausschlagungsOrt: {
    stepId: "wo-ausschlagen",
    pageSchema: {
      ausschlagungsOrt: z.enum(["courtNearMe", "courtNearDeceased"]),
    },
  },
  pflegeheim: {
    stepId: "pflegeheim",
    pageSchema: {
      pflegeheim: YesNoAnswer,
    },
  },
  plzPflegeheim: {
    stepId: "plz-pflegeheim",
    pageSchema: {
      plzPflegeheim: postcodeSchema,
    },
  },
  hospiz: {
    stepId: "hospiz",
    pageSchema: {
      hospiz: YesNoAnswer,
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
  gerichtErmitteltWohnsitz: {
    stepId: "ergebnis/gericht-ermittelt",
  },
} as const satisfies PagesConfig;

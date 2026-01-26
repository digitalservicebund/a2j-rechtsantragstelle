import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const erbscheinNachlassgerichtPages = {
  start: {
    stepId: "start",
    // verstorbeneName is potentially migrated from /erbschein/wegweiser and has no corresponding input field
    pageSchema: {
      verstorbeneName: stringOptionalSchema,
    },
  },
  lebensmittelpunkt: {
    stepId: "lebensmittelpunkt",
    pageSchema: {
      lebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  wohnsituation: {
    stepId: "wohnsituation",
    pageSchema: {
      wohnsituation: z.enum(["wohnungOderHaus", "pflegeheim", "hospiz"]),
    },
  },
  plzWohnungOderHaus: {
    stepId: "plz-wohnung-oder-haus",
    pageSchema: {
      plzWohnungOderHaus: postcodeSchema,
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
  strasseHausnummer: {
    stepId: "strasse-hausnummer",
    pageSchema: {
      strasse: stringRequiredSchema,
      houseNumber: stringRequiredSchema,
    },
  },
} as const satisfies PagesConfig;

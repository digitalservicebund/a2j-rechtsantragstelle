import { type PagesConfig } from "~/domains/pageSchemas";
import { createSplitDateSchema, MINUS_150_YEARS } from "~/services/validation/date";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

export const berHAntragPersoenlicheDatenPages = {
  persoenlicheDatenStart: {
    stepId: "persoenliche-daten/start",
  },
  name: {
    stepId: "persoenliche-daten/name",
    pageSchema: {
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
    },
  },
  geburtsdatum: {
    stepId: "persoenliche-daten/geburtsdatum",
    pageSchema: {
      geburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), MINUS_150_YEARS),
        latest: () => today(),
      }),
    },
  },
  plz: {
    stepId: "persoenliche-daten/plz",
    pageSchema: {
      plz: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  adresse: {
    stepId: "persoenliche-daten/adresse",
    pageSchema: {
      street: stringRequiredSchema,
      houseNumber: germanHouseNumberSchema,
      ort: stringRequiredSchema,
    },
  },
  telefonnummer: {
    stepId: "persoenliche-daten/telefonnummer",
    pageSchema: {
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
    },
  },
} as const satisfies PagesConfig;

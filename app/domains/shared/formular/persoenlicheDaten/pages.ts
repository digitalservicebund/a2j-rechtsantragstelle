import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { createDateSchema } from "~/services/validation/date";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const sharedPersoenlicheDatenPages = {
  title: {
    stepId: "persoenliche-daten/title",
    pageSchema: {
      title: z.enum(["", "dr"], customRequiredErrorMessage),
    },
  },
  name: {
    stepId: "persoenliche-daten/name",
    pageSchema: {
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
    },
  },
  namePrivatPerson: {
    stepId: "persoenliche-daten/namePrivatPerson",
    pageSchema: {
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      title: z.enum(["", "dr"], customRequiredErrorMessage),
    },
  },
  geburtsdatum: {
    stepId: "persoenliche-daten/geburtsdatum",
    pageSchema: {
      geburtsdatum: createDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }).optional(),
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
  streetHouseNumber: {
    stepId: "persoenliche-daten/streetHouseNumber",
    pageSchema: {
      street: stringRequiredSchema,
      houseNumber: germanHouseNumberSchema,
    },
  },
  telefonnummer: {
    stepId: "persoenliche-daten/telefonnummer",
    pageSchema: {
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
    },
  },
} as const satisfies PagesConfig;

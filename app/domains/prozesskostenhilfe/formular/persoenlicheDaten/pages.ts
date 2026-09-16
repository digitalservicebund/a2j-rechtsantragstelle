import { type PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestStreetNames } from "~/services/validation/autoSuggest";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

export const pkhFormularPersoenlicheDatenPages = {
  persoenlicheDatenStart: {
    stepId: "/persoenliche-daten/start",
  },
  name: {
    stepId: "/persoenliche-daten/name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
    },
  },
  geburtsdatum: {
    stepId: "/persoenliche-daten/geburtsdatum",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      geburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }).optional(),
    },
  },
  plz: {
    stepId: "/persoenliche-daten/plz",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      plz: stringRequiredSchema.pipe(postcodeSchema),
    },
  },
  adresse: {
    stepId: "/persoenliche-daten/adresse",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      street: autoSuggestStreetNames(["plz"]),
      houseNumber: germanHouseNumberSchema,
      ort: stringRequiredSchema,
    },
  },
  telefonnummer: {
    stepId: "/persoenliche-daten/telefonnummer",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
    },
  },
  beruf: {
    stepId: "/persoenliche-daten/beruf",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      beruf: stringRequiredSchema,
    },
  },
} as const satisfies PagesConfig;

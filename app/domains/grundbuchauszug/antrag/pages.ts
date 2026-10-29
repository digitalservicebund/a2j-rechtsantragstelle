import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { emailSchema } from "~/services/validation/email";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { integerSchema } from "~/services/validation/integer";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { addYears, today } from "~/util/date";

export const grundbuchauszugAntragPages = {
  start: {
    stepId: "/start",
  },
  antragsgrundBerechtigtesInteresse: {
    stepId: "/antragsgrund/berechtigtes-interesse/start",
    pageSchema: {
      legitimateInterest: z.enum([
        "owner",
        "landRegisterOnMyName",
        "otherReasons",
      ]),
    },
  },
  antragsgrundAngabenZumRecht: {
    stepId: "/antragsgrund/angaben-zum-recht/start",
    pageSchema: {
      registerLaw: stringRequiredSchema,
    },
  },
  antragsgrundNachweisHochladen: {
    stepId: "/antragsgrund/nachweis-hochladen/start",
  },
  grundstuecksdaten: {
    stepId: "/grundstuecksdaten",
    pageSchema: {
      landRegistryLocale: stringRequiredSchema,
      landRegisterParcel: stringRequiredSchema,
      landRegisterPageNumber: integerSchema,
    },
  },
  artAuszug: {
    stepId: "/artAuszug",
    pageSchema: {
      typeOfCopy: z.enum(["basic", "certificated"]),
    },
  },
  anzahlAusdrucke: {
    stepId: "/anzahlAusdrucke",
    pageSchema: {
      numberOfCopies: createNumberIncrementSchema(1, 20),
    },
  },
  persoenlicheDatenName: {
    stepId: "/persoenliche-daten/name/start",
    pageSchema: {
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      geburtsname: schemaOrEmptyStringOptional(stringOptionalSchema),
    },
  },
  persoenlicheDatenGeburtsdatum: {
    stepId: "/persoenliche-daten/geburtsdatum/start",
    pageSchema: {
      geburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  persoenlicheDatenAnschrift: {
    stepId: "/persoenliche-daten/anschrift/start",
    pageSchema: {
      strasse: stringRequiredSchema,
      hausnummer: germanHouseNumberSchema,
      plz: postcodeSchema,
      ort: stringRequiredSchema,
    },
  },
  persoenlicheDatenkontakt: {
    stepId: "/persoenliche-daten/kontakt",
    pageSchema: {
      email: emailSchema,
      telefonnummer: schemaOrEmptyStringOptional(phoneNumberSchema),
    },
  },
  abgabeZusammenfassung: {
    stepId: "/abgabe/zusammenfassung",
  },
} satisfies PagesConfig;

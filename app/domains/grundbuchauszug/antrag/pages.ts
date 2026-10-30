import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { emailSchema } from "~/services/validation/email";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { integerSchema } from "~/services/validation/integer";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";
import { pdfFileUploadArrayRequiredSchema } from "~/services/validation/pdfFileSchema";
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
    stepId: "/antragsgrund/berechtigtes-interesse",
    pageSchema: {
      legitimateInterest: z.enum([
        "owner",
        "landRegisterOnMyName",
        "otherReasons",
      ]),
    },
  },
  antragsgrundAngabenZumRecht: {
    stepId: "/antragsgrund/angaben-zum-recht",
    pageSchema: {
      registerLaw: stringRequiredSchema,
    },
  },
  antragsgrundNachweisHochladen: {
    stepId: "/antragsgrund/nachweis-hochladen",
    pageSchema: {
      proofFiles: pdfFileUploadArrayRequiredSchema,
    },
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
    stepId: "/art-auszug",
    pageSchema: {
      typeOfCopy: z.enum(["basic", "certificated"]),
    },
  },
  anzahlAusdrucke: {
    stepId: "/anzahl-ausdrucke",
    pageSchema: {
      numberOfCopies: createNumberIncrementSchema(1, 20),
    },
  },
  persoenlicheDatenName: {
    stepId: "/persoenliche-daten/name",
    pageSchema: {
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      geburtsname: schemaOrEmptyStringOptional(stringOptionalSchema),
    },
  },
  persoenlicheDatenGeburtsdatum: {
    stepId: "/persoenliche-daten/geburtsdatum",
    pageSchema: {
      geburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  persoenlicheDatenAnschrift: {
    stepId: "/persoenliche-daten/anschrift",
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

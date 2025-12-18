import type { PagesConfig } from "~/domains/pageSchemas";
import { emailSchema } from "~/services/validation/email";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { ibanSchema } from "~/services/validation/iban";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const kontopfaendungPkontoAntragPages = {
  bestehendesPkonto: {
    stepId: "grundvoraussetzungen/bestehendes-pkonto",
    pageSchema: {
      bestehendesPkonto: YesNoAnswer,
    },
  },
  ende: {
    stepId: "grundvoraussetzungen/ende",
  },
  girokontoUmwandeln: {
    stepId: "grundvoraussetzungen/girokonto-umwandeln",
    pageSchema: {
      girokontoUmwandeln: YesNoAnswer,
    },
  },
  neuesPkontoEroeffnen: {
    stepId: "grundvoraussetzungen/neues-pkonto-eroeffnen",
  },
  negativerKontostand: {
    stepId: "grundvoraussetzungen/negativer-kontostand",
    pageSchema: {
      negativerKontostand: YesNoAnswer,
    },
  },
  bankdatenEinleitung: {
    stepId: "bankdaten/einleitung",
  },
  bankdatenKontodaten: {
    stepId: "bankdaten/kontodaten",
    pageSchema: {
      kontoinhaberVorname: stringRequiredSchema,
      kontoinhaberNachname: stringRequiredSchema,
      iban: ibanSchema,
      bankName: stringRequiredSchema,
    },
  },
  kontoinhaberAnschrift: {
    stepId: "persoenliche-daten/kontoinhaber-anschrift",
    pageSchema: {
      kontoinhaberStrasse: stringRequiredSchema,
      kontoinhaberHausnummer: germanHouseNumberSchema,
      kontoinhaberPlz: postcodeSchema,
      kontoinhaberOrt: stringRequiredSchema,
    },
  },
  kontakt: {
    stepId: "persoenliche-daten/kontakt",
    pageSchema: {
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
      emailadresse: schemaOrEmptyString(emailSchema),
    },
  },
} as const satisfies PagesConfig;

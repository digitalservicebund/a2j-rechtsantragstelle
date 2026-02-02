import type { PagesConfig } from "~/domains/pageSchemas";
import { emailSchema } from "~/services/validation/email";
import { ibanSchema } from "~/services/validation/iban";
import { integerSchema } from "~/services/validation/integer";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
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
  bankdatenEinleitung: {
    stepId: "bankdaten/einleitung",
  },
  bankdatenKontodaten: {
    stepId: "bankdaten/kontodaten",
    pageSchema: {
      iban: ibanSchema,
      bankName: stringRequiredSchema,
    },
  },
  kontoinhaberName: {
    stepId: "persoenliche-daten/kontoinhaber-name",
    pageSchema: {
      vollstaendigerName: stringRequiredSchema,
    },
  },
  kontoinhaberAnschrift: {
    stepId: "persoenliche-daten/kontoinhaber-anschrift",
    pageSchema: {
      kontoinhaberStrasseHausnummer: stringRequiredSchema,
      kontoinhaberPlz: integerSchema,
      kontoinhaberOrt: stringRequiredSchema,
      kontoinhaberLand: stringOptionalSchema,
    },
  },
  kontakt: {
    stepId: "persoenliche-daten/kontakt",
    pageSchema: {
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
      emailadresse: schemaOrEmptyString(emailSchema),
    },
  },
  zusammenfassung: {
    stepId: "abgabe/zusammenfassung",
  },
  ergebnis: {
    stepId: "abgabe/p-konto-vorhanden",
  },
} as const satisfies PagesConfig;

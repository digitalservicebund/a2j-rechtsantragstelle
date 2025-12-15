import type { PagesConfig } from "~/domains/pageSchemas";
import { ibanSchema } from "~/services/validation/iban";
import { postcodeSchema } from "~/services/validation/postcode";
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
  girokontoUmwandeln: {
    stepId: "grundvoraussetzungen/girokonto-umwandeln",
    pageSchema: {
      girokontoUmwandeln: YesNoAnswer,
    },
  },
  neuesPkontoEroeffnen: {
    stepId: "grundvoraussetzungen/neues-pkonto-eroeffnen",
  },
  alleinigKontofuehrend: {
    stepId: "grundvoraussetzungen/alleinig-kontofuehrend",
    pageSchema: {
      alleinigKontofuehrend: YesNoAnswer,
    },
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
      kontoinhaber: stringRequiredSchema,
      iban: ibanSchema,
      bankName: stringRequiredSchema,
    },
  },
  persoenlicheDatenNameAnschrift: {
    stepId: "persoenliche-daten/name-anschrift",
    pageSchema: {
      vornameNachname: stringRequiredSchema,
      strasseHausnummer: stringRequiredSchema,
      plz: postcodeSchema,
      ort: stringRequiredSchema,
    },
  },
  persoenlicheDatenKontakt: {
    stepId: "persoenliche-daten/kontakt",
    pageSchema: {
      telefonnummer: stringOptionalSchema,
      emailadresse: stringOptionalSchema,
    },
  },
} as const satisfies PagesConfig;

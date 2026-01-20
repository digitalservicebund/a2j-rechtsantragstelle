import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { ibanSchema } from "~/services/validation/iban";
import { buildOptionalMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const sharedBeklagteAddress = {
  beklagteStrasseHausnummer: stringRequiredSchema,
  beklagtePlz: stringRequiredSchema.pipe(postcodeSchema),
  beklagteOrt: stringRequiredSchema,
};

export const geldEinklagenKlageErstellenPages = {
  klageErstellenIntroStart: {
    stepId: "klage-erstellen/intro/start",
  },
  streitWertKostenGerichtskostenvorschuss: {
    stepId: "klage-erstellen/streitwert-kosten/gerichtskostenvorschuss",
  },
  streitwertKostenWeitereKosten: {
    stepId: "klage-erstellen/streitwert-kosten/weitere-kosten",
  },
  klagendePersonKontaktdaten: {
    stepId: "klage-erstellen/klagende-person/kontaktdaten",
    pageSchema: {
      klagendePersonAnrede: z.enum(["herr", "frau", "none"]),
      klagendePersonTitle: z.enum(["none", "dr"]),
      klagendePersonVorname: stringRequiredSchema,
      klagendePersonNachname: stringRequiredSchema,
      klagendePersonStrasseHausnummer: stringRequiredSchema,
      klagendePersonPlz: stringRequiredSchema.pipe(postcodeSchema),
      klagendePersonOrt: stringRequiredSchema,
      klagendeTelefonnummer: schemaOrEmptyString(phoneNumberSchema),
      klagendePersonIban: schemaOrEmptyString(ibanSchema),
      klagendePersonKontoinhaber: stringOptionalSchema,
    },
  },
  beklagtePersonMenschen: {
    stepId: "klage-erstellen/beklagte-person/mensch",
    pageSchema: {
      gegenWenBeklagen: hiddenInputSchema(z.enum(["person", "organisation"])),
      beklagteAnrede: z.enum(["herr", "frau", "none"]),
      beklagteTitle: z.enum(["none", "dr"]),
      beklagteVorname: stringRequiredSchema,
      beklagteNachname: stringRequiredSchema,
      ...sharedBeklagteAddress,
    },
  },
  beklagtePersonOrganisation: {
    stepId: "klage-erstellen/beklagte-person/organisation",
    pageSchema: {
      gegenWenBeklagen: hiddenInputSchema(z.enum(["person", "organisation"])),
      beklagteNameOrganisation: stringRequiredSchema,
      beklagteGesetzlichenVertretung: stringRequiredSchema,
      ...sharedBeklagteAddress,
    },
  },
  rechtsproblemIntoStart: {
    stepId: "klage-erstellen/rechtsproblem/intro/start",
  },
  prozessfuehrungProzesszinsen: {
    stepId: "klage-erstellen/prozessfuehrung/prozesszinsen",
    pageSchema: {
      prozesszinsen: YesNoAnswer,
    },
  },
  prozessfuehrungAnwaltskosten: {
    stepId: "klage-erstellen/prozessfuehrung/anwaltskosten",
    pageSchema: {
      anwaltskosten: buildOptionalMoneyValidationSchema(),
    },
  },
  prozessfuehrungStreitbeilegung: {
    stepId: "klage-erstellen/prozessfuehrung/streitbeilegung",
    pageSchema: {
      streitbeilegung: z.enum(["yes", "no", "noSpecification"]),
    },
  },
  prozessfuehrungStreitbeilegungGruende: {
    stepId: "klage-erstellen/prozessfuehrung/streitbeilegung-gruende",
    pageSchema: {
      streitbeilegungGruende: z.enum(["yes", "no", "noSpecification"]),
    },
  },
  prozessfuehrungMuendlicheVerhandlung: {
    stepId: "klage-erstellen/prozessfuehrung/muendliche-verhandlung",
    pageSchema: { muendlicheVerhandlung: YesNoAnswer },
  },
  prozessfuehrungVideoVerhandlung: {
    stepId: "klage-erstellen/prozessfuehrung/videoverhandlung",
    pageSchema: { videoVerhandlung: YesNoAnswer },
  },
  prozessfuehrungVersaeumnisurteil: {
    stepId: "klage-erstellen/prozessfuehrung/versaeumnisurteil",
    pageSchema: { versaeumnisurteil: YesNoAnswer },
  },
  prozessfuehrungZahlungNachKlageeinreichung: {
    stepId: "klage-erstellen/prozessfuehrung/zahlung-nach-klageeinreichung",
  },
  rechtlicherZusatzWeitereAntraege: {
    stepId: "klage-erstellen/rechtlicher-zusatz/weitere-antraege",
    pageSchema: {
      weitereAntraege: schemaOrEmptyString(stringRequiredSchema),
    },
  },
  rechtlicherZusatzRechtlicheWuerdigung: {
    stepId: "klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung",
    pageSchema: {
      rechtlicheWuerdigung: schemaOrEmptyString(stringRequiredSchema),
    },
  },
} as const satisfies PagesConfig;

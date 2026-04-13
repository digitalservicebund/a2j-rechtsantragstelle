import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { emailSchema } from "~/services/validation/email";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { ibanSchema } from "~/services/validation/iban";
import {
  buildOptionalMoneyValidationSchema,
  buildMoneyValidationSchema,
  formatCurrencyZodDescription,
} from "~/services/validation/money/buildMoneyValidationSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import {
  stringRequiredSchema,
  stringRequiredMaxSchema,
} from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const TEXTAREA_MAX_LENGTH = 60000;

const statePrefilled = z
  .enum(["prefilled", "filledByUser", "unfilled"])
  .default("filledByUser");

const sharedBeklagteAddress = {
  beklagteStrasseHausnummer: stringRequiredSchema,
  beklagtePlz: stringRequiredSchema.pipe(postcodeSchema),
  beklagteOrt: stringRequiredSchema,
  beklagteStatePrefilled: hiddenInputSchema(statePrefilled),
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
      klagendePersonStatePrefilled: hiddenInputSchema(statePrefilled),
      klagendePersonOrt: stringRequiredSchema,
      klagendeTelefonnummer: schemaOrEmptyString(phoneNumberSchema),
      klagendeEmail: schemaOrEmptyString(emailSchema),
      klagendePersonIban: schemaOrEmptyString(ibanSchema),
      klagendePersonKontoinhaber: stringOptionalSchema,
    },
    readonlyFields: {
      fieldNames: ["klagendePersonPlz", "klagendePersonOrt"],
      shouldMakeReadOnly: (userData) =>
        !!userData.klagendePersonStatePrefilled &&
        userData.klagendePersonStatePrefilled === "prefilled",
    },
  },
  klagendePersonAnwaltschaft: {
    stepId: "klage-erstellen/klagende-person/kontaktdaten-anwaltschaft",
    pageSchema: {
      klagendePersonAnwaltschaftKanzlei: stringOptionalSchema,
      klagendePersonAnwaltschaftGeschaeftszeichen: stringOptionalSchema,
      klagendePersonAnwaltschaftStrasseHausnummer: stringRequiredSchema,
      klagendePersonAnwaltschaftPlz: stringRequiredSchema.pipe(postcodeSchema),
      klagendePersonAnwaltschaftOrt: stringRequiredSchema,
      klagendePersonAnwaltschaftAnrede: z.enum(["herr", "frau", "none"]),
      klagendePersonAnwaltschaftTitle: stringOptionalSchema,
      klagendePersonAnwaltschaftVorname: stringRequiredSchema,
      klagendePersonAnwaltschaftNachname: stringRequiredSchema,
      klagendePersonAnwaltschaftBerufsbezeichnung: stringOptionalSchema,
      klagendePersonAnwaltschaftTelefonnummer:
        schemaOrEmptyString(phoneNumberSchema),
      klagendePersonAnwaltschaftEmail: schemaOrEmptyString(emailSchema),
    },
  },
  beklagtePersonMenschen: {
    stepId: "klage-erstellen/beklagte-person/mensch",
    pageSchema: {
      beklagteAnrede: z.enum(["herr", "frau", "none"]),
      beklagteTitle: z.enum(["none", "dr"]),
      beklagteVorname: stringRequiredSchema,
      beklagteNachname: stringRequiredSchema,
      ...sharedBeklagteAddress,
    },
    readonlyFields: {
      fieldNames: ["beklagtePlz", "beklagteOrt"],
      shouldMakeReadOnly: (userData) =>
        !!userData.beklagteStatePrefilled &&
        userData.beklagteStatePrefilled === "prefilled",
    },
  },
  beklagtePersonOrganisation: {
    stepId: "klage-erstellen/beklagte-person/organisation",
    pageSchema: {
      beklagteNameOrganisation: stringRequiredSchema,
      ...sharedBeklagteAddress,
      beklagteGesetzlichenVertretungAnrede: z.enum(["herr", "frau", "none"]),
      beklagteGesetzlichenVertretungTitle: z.enum(["none", "dr"]),
      beklagteGesetzlichenVertretungVorname: stringOptionalSchema,
      beklagteGesetzlichenVertretungNachname: stringOptionalSchema,
    },
  },
  forderungGesamtbetrag: {
    stepId: "klage-erstellen/forderung/gesamtbetrag",
    pageSchema: {
      forderungGesamtbetrag: buildMoneyValidationSchema({
        max: 1000000,
      }).meta({ description: formatCurrencyZodDescription }),
    },
  },
  sachverhaltBegruendung: {
    stepId: "klage-erstellen/sachverhalt/begruendung",
    pageSchema: {
      sachverhaltBegruendung: stringRequiredMaxSchema({
        max: TEXTAREA_MAX_LENGTH,
      }),
    },
  },
  beweiseAngebot: {
    stepId: "klage-erstellen/beweise/angebot",
    pageSchema: {
      beweiseAngebot: YesNoAnswer,
    },
  },
  beweiseBeschreibung: {
    stepId: "klage-erstellen/beweise/beschreibung",
    pageSchema: {
      beweiseBeschreibung: stringRequiredMaxSchema({
        max: TEXTAREA_MAX_LENGTH,
      }),
    },
  },
  prozessfuehrungAnwaltskosten: {
    stepId: "klage-erstellen/prozessfuehrung/anwaltskosten",
    pageSchema: {
      anwaltskosten: buildOptionalMoneyValidationSchema({
        min: 1,
      }).meta({ description: formatCurrencyZodDescription }),
    },
  },
  prozessfuehrungProzesszinsen: {
    stepId: "klage-erstellen/prozessfuehrung/prozesszinsen",
    pageSchema: {
      prozesszinsen: YesNoAnswer,
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
    pageSchema: {
      muendlicheVerhandlung: z.enum(["yes", "no", "noSpecification"]),
    },
  },
  prozessfuehrungVideoVerhandlung: {
    stepId: "klage-erstellen/prozessfuehrung/videoverhandlung",
    pageSchema: { videoVerhandlung: z.enum(["yes", "no", "noSpecification"]) },
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
      weitereAntraege: schemaOrEmptyString(
        stringRequiredMaxSchema({ max: TEXTAREA_MAX_LENGTH }),
      ),
    },
  },
  rechtlicherZusatzRechtlicheWuerdigung: {
    stepId: "klage-erstellen/rechtlicher-zusatz/rechtliche-wuerdigung",
    pageSchema: {
      rechtlicheWuerdigung: schemaOrEmptyString(
        stringRequiredMaxSchema({ max: TEXTAREA_MAX_LENGTH }),
      ),
    },
  },
  zusammenfassungUebersicht: {
    stepId: "klage-erstellen/zusammenfassung/uebersicht",
  },
} as const satisfies PagesConfig;

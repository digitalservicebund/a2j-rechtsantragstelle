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
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import {
  stringRequiredSchema,
  stringRequiredMaxSchema,
} from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  datatypeA,
  datatypeB,
  datatypeC,
  datatypeD,
} from "~/services/validation/xjustiz/xjustizDatatype";

const TEXTAREA_MAX_LENGTH = 60000;

const statePrefilled = z
  .enum(["prefilled", "filledByUser", "unfilled"])
  .default("filledByUser");

const sharedBeklagteAddress = {
  beklagteStrasse: stringRequiredSchema.check(datatypeB),
  beklagteHausnummer: germanHouseNumberSchema.check(datatypeB),
  beklagtePlz: stringRequiredSchema.pipe(postcodeSchema).check(datatypeC),
  beklagteOrt: stringRequiredSchema.check(datatypeB),
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
      klagendePersonAnrede: schemaOrEmptyString(
        z.enum(["herr", "frau", "none"]),
      ),
      klagendePersonTitle: schemaOrEmptyString(z.enum(["none", "dr"])),
      klagendePersonVorname: stringRequiredSchema.check(datatypeA),
      klagendePersonNachname: stringRequiredSchema.check(datatypeA),
      klagendePersonStrasse: stringRequiredSchema.check(datatypeB),
      klagendePersonHausnummer: germanHouseNumberSchema.check(datatypeB),
      klagendePersonPlz: stringRequiredSchema
        .pipe(postcodeSchema)
        .check(datatypeC),
      klagendePersonStatePrefilled: hiddenInputSchema(statePrefilled),
      klagendePersonOrt: stringRequiredSchema.check(datatypeB),
      klagendeTelefonnummer:
        schemaOrEmptyString(phoneNumberSchema).check(datatypeC),
      klagendeEmail: schemaOrEmptyString(emailSchema).check(datatypeC),
      klagendePersonIban: schemaOrEmptyString(ibanSchema).check(datatypeC),
      klagendePersonKontoinhaber: stringOptionalSchema.check(datatypeD),
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
      klagendePersonAnwaltschaftWerProzessBevollmaechtigt: z.enum([
        "berufsausuebungsgesellschaft",
        "einzelkanzlei",
      ]),
      klagendePersonAnwaltschaftKanzlei: stringOptionalSchema.check(datatypeD),
      klagendePersonAnwaltschaftGeschaeftszeichen:
        stringOptionalSchema.check(datatypeC),
      klagendePersonAnwaltschaftStrasse: stringRequiredSchema.check(datatypeB),
      klagendePersonAnwaltschaftHausnummer:
        germanHouseNumberSchema.check(datatypeB),
      klagendePersonAnwaltschaftPlz: stringRequiredSchema
        .pipe(postcodeSchema)
        .check(datatypeC),
      klagendePersonAnwaltschaftOrt: stringRequiredSchema.check(datatypeB),
      klagendePersonAnwaltschaftAnrede: schemaOrEmptyString(
        z.enum(["herr", "frau", "none"]),
      ),
      klagendePersonAnwaltschaftTitle: stringOptionalSchema.check(datatypeC),
      klagendePersonAnwaltschaftVorname: stringRequiredSchema.check(datatypeA),
      klagendePersonAnwaltschaftNachname: stringRequiredSchema.check(datatypeA),
      klagendePersonAnwaltschaftBerufsbezeichnung:
        stringOptionalSchema.check(datatypeC),
      klagendePersonAnwaltschaftTelefonnummer:
        schemaOrEmptyString(phoneNumberSchema).check(datatypeC),
      klagendePersonAnwaltschaftEmail:
        schemaOrEmptyString(emailSchema).check(datatypeC),
    },
  },
  beklagtePersonMenschen: {
    stepId: "klage-erstellen/beklagte-person/mensch",
    pageSchema: {
      beklagteAnrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
      beklagteTitle: schemaOrEmptyString(z.enum(["none", "dr"])),
      beklagteVorname: stringRequiredSchema.check(datatypeA),
      beklagteNachname: stringRequiredSchema.check(datatypeA),
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
      beklagteGesetzlichenVertretungAnrede: schemaOrEmptyString(
        z.enum(["herr", "frau", "none"]),
      ),
      beklagteGesetzlichenVertretungTitle: schemaOrEmptyString(
        z.enum(["none", "dr"]),
      ),
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
      }).check(datatypeC),
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

export type GeldEinklagenKlageErstellenPages =
  typeof geldEinklagenKlageErstellenPages;

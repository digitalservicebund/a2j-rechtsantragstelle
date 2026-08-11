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
import { begruendungBeschreibungUebersichtSchema } from "./begruendung/begruendungBeschreibungUebersichtSchema";

const TEXTAREA_MAX_LENGTH = 60000;

const statePrefilled = z
  .enum(["prefilled", "filledByUser", "unfilled"])
  .default("filledByUser");

const personIdOnAbschnittSchema = hiddenInputSchema(
  schemaOrEmptyString(z.string().optional()),
);

const personIdSchema = hiddenInputSchema(
  z
    .string()
    .optional()
    .transform((val) => (val === "" ? crypto.randomUUID() : val))
    .default(() => crypto.randomUUID()),
);

const sharedBeklagteAddress = {
  beklagteStrasse: stringRequiredSchema,
  beklagteHausnummer: germanHouseNumberSchema,
  beklagtePlz: stringRequiredSchema.pipe(postcodeSchema),
  beklagteOrt: stringRequiredSchema,
  beklagteStatePrefilled: hiddenInputSchema(statePrefilled),
};

const beweiseDokumentenArray = z.array(
  z.object({
    beschreibung: stringRequiredSchema,
  }),
);

const beweisePersonenSchema = z.object({
  anrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
  title: schemaOrEmptyString(stringRequiredSchema),
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  strasse: stringRequiredSchema,
  hausnummer: germanHouseNumberSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  telefonnummer: schemaOrEmptyString(phoneNumberSchema),
  email: schemaOrEmptyString(emailSchema),
});

const beweisePersonenArray = z.array(
  z.union([
    z.object({
      personAuswahl: z.enum(["beklagte", "klagende"]),
      personId: personIdSchema,
    }),
    z.object({
      personAuswahl: z.literal("anotherPerson"),
      ...beweisePersonenSchema.shape,
      personId: personIdSchema,
    }),
  ]),
);

const abschnitteArray = z.array(
  z.object({
    beschreibung: stringRequiredMaxSchema({ max: 12000 }),
    personIdAsBeklagte: personIdOnAbschnittSchema,
    personIdAsKlagende: personIdOnAbschnittSchema,
    dokumenten: beweiseDokumentenArray.optional(),
    personen: beweisePersonenArray.optional(),
  }),
);

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
      klagendePersonVorname: stringRequiredSchema,
      klagendePersonNachname: stringRequiredSchema,
      klagendePersonStrasse: stringRequiredSchema,
      klagendePersonHausnummer: germanHouseNumberSchema,
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
      klagendePersonAnwaltschaftStrasse: stringRequiredSchema,
      klagendePersonAnwaltschaftHausnummer: germanHouseNumberSchema,
      klagendePersonAnwaltschaftPlz: stringRequiredSchema.pipe(postcodeSchema),
      klagendePersonAnwaltschaftOrt: stringRequiredSchema,
      klagendePersonAnwaltschaftAnrede: schemaOrEmptyString(
        z.enum(["herr", "frau", "none"]),
      ),
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
      beklagteAnrede: schemaOrEmptyString(z.enum(["herr", "frau", "none"])),
      beklagteTitle: schemaOrEmptyString(z.enum(["none", "dr"])),
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
  begruendungEinfuehrungStart: {
    stepId: "klage-erstellen/begruendung/einfuehrung/start",
  },
  begruendungBeschreibungUebersicht: {
    stepId: "klage-erstellen/begruendung/beschreibung/uebersicht",
    pageSchema: {
      begruendungBeschreibungUebersicht:
        begruendungBeschreibungUebersichtSchema,
    },
    arraySummary: {
      name: "abschnitte",
      schema: abschnitteArray,
      isArrayRelevant: () => true,
    },
  },
  begruendungBeschreibungAbschnitte: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "klage-erstellen/begruendung/beschreibung/abschnitte/#/daten",
    pageSchema: {
      "abschnitte#beschreibung": abschnitteArray.element.shape.beschreibung,
      "abschnitte#personIdAsBeklagte":
        abschnitteArray.element.shape.personIdAsBeklagte,
      "abschnitte#personIdAsKlagende":
        abschnitteArray.element.shape.personIdAsKlagende,
    },
  },
  begruendungBeschreibungAbschnitteBeweisDocument: {
    shouldCollapseIntoParentNavItem: true,
    stepId:
      "klage-erstellen/begruendung/beschreibung/abschnitte/#/dokumenten/#/daten",
    pageSchema: {
      "abschnitte#dokumenten#beschreibung":
        beweiseDokumentenArray.element.shape.beschreibung,
    },
  },
  begruendungBeschreibungAbschnitteBeweisPersonAuswahl: {
    shouldCollapseIntoParentNavItem: true,
    stepId:
      "klage-erstellen/begruendung/beschreibung/abschnitte/#/personen/#/auswahl",
    pageSchema: {
      "abschnitte#personen#personAuswahl": z.enum([
        "klagende",
        "beklagte",
        "anotherPerson",
      ]),
      "abschnitte#personIdAsBeklagte":
        abschnitteArray.element.shape.personIdAsBeklagte,
      "abschnitte#personIdAsKlagende":
        abschnitteArray.element.shape.personIdAsKlagende,
      "abschnitte#personen#personId": personIdSchema,
    },
  },
  begruendungBeschreibungAbschnitteBeweisPerson: {
    shouldCollapseIntoParentNavItem: true,
    stepId:
      "klage-erstellen/begruendung/beschreibung/abschnitte/#/personen/#/daten",
    pageSchema: {
      "abschnitte#personen#anrede": beweisePersonenSchema.shape.anrede,
      "abschnitte#personen#title": beweisePersonenSchema.shape.title,
      "abschnitte#personen#vorname": beweisePersonenSchema.shape.vorname,
      "abschnitte#personen#nachname": beweisePersonenSchema.shape.nachname,
      "abschnitte#personen#strasse": beweisePersonenSchema.shape.strasse,
      "abschnitte#personen#hausnummer": beweisePersonenSchema.shape.hausnummer,
      "abschnitte#personen#plz": beweisePersonenSchema.shape.plz,
      "abschnitte#personen#ort": beweisePersonenSchema.shape.ort,
      "abschnitte#personen#land": beweisePersonenSchema.shape.land,
      "abschnitte#personen#telefonnummer":
        beweisePersonenSchema.shape.telefonnummer,
      "abschnitte#personen#email": beweisePersonenSchema.shape.email,
    },
  },
  begruendungBeschreibungWarnung: {
    stepId: "klage-erstellen/begruendung/beschreibung/warnung",
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

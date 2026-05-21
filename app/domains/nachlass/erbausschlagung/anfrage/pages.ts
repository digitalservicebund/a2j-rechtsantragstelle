import { z } from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { emailSchema } from "~/services/validation/email";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const kinderUnder18ArraySchema = z.array(
  z
    .object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      geburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -18),
        latest: () => today(),
      }),
      wohnortBeiAntragsteller: YesNoAnswer,
      strasse: stringRequiredSchema,
      hausnummer: germanHouseNumberSchema,
      plz: postcodeSchema,
      ort: stringRequiredSchema,
      adresseZusatz: stringOptionalSchema,
      optionSorgerecht: z.enum([
        "yes",
        "shared",
        "anotherPerson",
        "anotherOrganization",
      ]),
      hasRenouncedInheritance: YesNoAnswer,
      vornameSorgerecht: stringRequiredSchema,
      nachnameSorgerecht: stringRequiredSchema,
      geburtsnameSorgerecht: stringOptionalSchema,
      hasSorgerechtSameAddress: YesNoAnswer,
      strasseSorgerecht: stringRequiredSchema,
      hausnummerSorgerecht: germanHouseNumberSchema,
      plzSorgerecht: postcodeSchema,
      ortSorgerecht: stringRequiredSchema,
      adresseZusatzSorgerecht: stringOptionalSchema,
      organizationNameSorgerecht: stringRequiredSchema,
      organizationStrasseSorgerecht: stringRequiredSchema,
      organizationHausnummerSorgerecht: germanHouseNumberSchema,
      organizationPlzSorgerecht: postcodeSchema,
      organizationOrtSorgerecht: stringRequiredSchema,
      organizationAdressZusatzSorgerecht: stringOptionalSchema,
    })
    .partial(),
);

export const nachlassErbausschlagungAnfragePages = {
  start: {
    stepId: "start/start",
  },
  datenverarbeitung: {
    stepId: "start/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  verstorbeneName: {
    stepId: "verstorbene/name",
    pageSchema: {
      verstorbeneVorname: stringRequiredSchema,
      verstorbeneNachname: stringRequiredSchema,
      verstorbeneGeburtsname: stringOptionalSchema,
    },
  },
  verstorbeneGeburtsdatum: {
    stepId: "verstorbene/geburtsdatum",
    pageSchema: {
      verstorbeneGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  verstorbeneSterbedatum: {
    stepId: "verstorbene/sterbedatum",
    pageSchema: {
      verstorbeneSterbedatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  verstorbeneLebensmittelpunkt: {
    stepId: "verstorbene/lebensmittelpunkt",
    pageSchema: {
      verstorbeneLebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  pflegeheim: {
    stepId: "verstorbene/pflegeheim",
    pageSchema: {
      livedInNursingHome: YesNoAnswer,
    },
  },
  hospiz: {
    stepId: "verstorbene/hospiz",
    pageSchema: {
      livedInHospice: YesNoAnswer,
    },
  },
  plzBeforeHospiz: {
    stepId: "verstorbene/plz-vor-hospiz",
    pageSchema: {
      plzBeforeHospiz: postcodeSchema,
    },
  },
  pflegeheimPLZ: {
    stepId: "verstorbene/pflegeheim-plz",
    pageSchema: {
      plzPflegeheim: postcodeSchema,
    },
  },
  verstorbenePlz: {
    stepId: "verstorbene/plz",
    pageSchema: {
      plzVerstorbene: postcodeSchema,
    },
  },
  verstorbeneAdresse: {
    stepId: "verstorbene/adresse",
    pageSchema: {
      verstorbeneAdresseStrasse: stringRequiredSchema,
      verstorbeneAdresseHausnummer: germanHouseNumberSchema,
      verstorbeneAdresseOrt: stringRequiredSchema,
      verstorbeneAdresseZusatz: stringOptionalSchema,
    },
  },
  verstorbeneAuslaendischeAdresse: {
    stepId: "verstorbene/auslaendische-adresse",
    pageSchema: {
      verstorbeneAuslaendischeAdresseStrasse: stringRequiredSchema,
      verstorbeneAuslaendischeAdresseHausnummer: germanHouseNumberSchema,
      verstorbeneAuslaendischeAdressePLZ: stringRequiredSchema,
      verstorbeneAuslaendischeAdresseOrt: stringRequiredSchema,
      verstorbeneAuslaendischeAdresseZusatz: stringOptionalSchema,
      verstorbeneAuslaendischeAdresseLand: stringRequiredSchema,
    },
  },
  testament: {
    stepId: "verstorbene/testament",
    pageSchema: {
      testament: z.enum([
        "none",
        "handwritten",
        "notarized",
        "erbvertrag",
        "unknown",
      ]),
    },
  },
  namedInTestament: {
    stepId: "verstorbene/im-testament-genannt",
    pageSchema: {
      namedInTestament: YesNoAnswer,
    },
  },
  letterReceivedFromNachlassgericht: {
    stepId: "verstorbene/brief-vom-nachlassgericht",
    pageSchema: {
      letterReceivedFromNachlassgericht: YesNoAnswer,
    },
  },
  letterReceivedFromCourt: {
    stepId: "verstorbene/brief-vom-gericht",
    pageSchema: {
      dateOfReceipt: createSplitDateSchema({
        latest: () => today(),
      }),
      weitereAngaben: stringOptionalSchema,
    },
  },
  awarenessDate: {
    stepId: "verstorbene/kenntnisdatum",
    pageSchema: {
      awarenessDate: createSplitDateSchema({
        latest: () => today(),
      }),
    },
  },
  ausschlagungNotNecessary: {
    stepId: "verstorbene/ausschlagung-nicht-notwendig",
  },
  ausschlagendePersonName: {
    stepId: "ausschlagende-person/name",
    pageSchema: {
      ausschlagendePersonVorname: stringRequiredSchema,
      ausschlagendePersonNachname: stringRequiredSchema,
      ausschlagendePersonGeburtsname: stringOptionalSchema,
    },
  },
  ausschlagendePersonPlz: {
    stepId: "ausschlagende-person/plz",
    pageSchema: {
      ausschlagendePersonPlz: postcodeSchema,
    },
  },
  ausschlagendePersonAdresse: {
    stepId: "ausschlagende-person/adresse",
    pageSchema: {
      ausschlagendePersonStrasse: stringRequiredSchema,
      ausschlagendePersonHausnummer: germanHouseNumberSchema,
      ausschlagendePersonOrt: stringRequiredSchema,
      ausschlagendePersonZusatz: stringOptionalSchema,
    },
  },
  ausschlagendePersonContact: {
    stepId: "ausschlagende-person/kontakt",
    pageSchema: {
      ausschlagendePersonTelefon: phoneNumberSchema,
      ausschlagendePersonEmail: schemaOrEmptyString(emailSchema),
    },
  },
  ausschlagendePersonBirthday: {
    stepId: "ausschlagende-person/geburtsdatum",
    pageSchema: {
      ausschlagendePersonGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  ausschlagendePersonRelationToErblasser: {
    stepId: "ausschlagende-person/beziehung-zum-erblasser",
    pageSchema: {
      ausschlagendePersonBeziehungZumErblasser: z.enum([
        "mother-father",
        "daughter-son",
        "grandmother-grandfather",
        "granddaughter-grandson",
        "great-grandmother-great-grandfather",
        "sister-brother",
        "half-sister-half-brother",
        "niece-nephew",
        "aunt-uncle",
        "cousin",
        "great-aunt-great-uncle",
        "wife-husband",
        "life-partner",
        "mother-in-law-father-in-law",
        "sister-in-law-brother-in-law",
        "daughter-in-law-son-in-law",
        "stepmother-stepfather",
        "stepdaughter-stepson",
        "stepsister-stepbrother",
        "foster-mother-foster-father",
        "foster-child",
        "adoptive-mother-adoptive-father",
        "godmother-godfather",
        "other",
      ]),
    },
  },
  kinderHasKid: {
    stepId: "kinder/haben-sie-kinder",
    pageSchema: {
      hasKid: YesNoAnswer,
    },
  },
  kinderHowManyKids: {
    stepId: "kinder/wie-viele-kinder",
    pageSchema: {
      numberOfKids: createNumberIncrementSchema(1, 20),
    },
  },
  kinderHowManyKidsUnder18: {
    stepId: "kinder/wie-viele-kinder-unter-18",
    pageSchema: {
      numberOfKidsUnder18: createNumberIncrementSchema(0, 20),
    },
  },
  kinderHowManyKidsOlder18: {
    stepId: "kinder/wie-viele-kinder-alter-18",
    pageSchema: {
      numberOfKidsOlder18: createNumberIncrementSchema(0, 20),
    },
  },
  kinderUnder18Uebersicht: {
    stepId: "kinder/kinder-unter-18/uebersicht",
  },
  kinderUnder18Warnung: {
    stepId: "kinder/kinder-unter-18/warnung",
  },
  kinderUnder18: {
    stepId: "kinder/kinder-unter-18/kinder",
    pageSchema: {
      kinderUnder18: kinderUnder18ArraySchema,
    },
    arrayPages: {
      name: {
        pageSchema: {
          "kinderUnder18#vorname":
            kinderUnder18ArraySchema.element.shape.vorname,
          "kinderUnder18#nachname":
            kinderUnder18ArraySchema.element.shape.nachname,
          "kinderUnder18#geburtsdatum":
            kinderUnder18ArraySchema.element.shape.geburtsdatum,
        },
      },
      wohnort: {
        pageSchema: {
          "kinderUnder18#wohnortBeiAntragsteller":
            kinderUnder18ArraySchema.element.shape.wohnortBeiAntragsteller,
        },
      },
      adresse: {
        pageSchema: {
          "kinderUnder18#strasse":
            kinderUnder18ArraySchema.element.shape.strasse,
          "kinderUnder18#hausnummer":
            kinderUnder18ArraySchema.element.shape.hausnummer,
          "kinderUnder18#plz": kinderUnder18ArraySchema.element.shape.plz,
          "kinderUnder18#ort": kinderUnder18ArraySchema.element.shape.ort,
          "kinderUnder18#adresseZusatz":
            kinderUnder18ArraySchema.element.shape.adresseZusatz,
        },
      },
      sorgerecht: {
        pageSchema: {
          "kinderUnder18#optionSorgerecht":
            kinderUnder18ArraySchema.element.shape.optionSorgerecht,
        },
      },
      "erbe-ausschlagende": {
        pageSchema: {
          "kinderUnder18#hasRenouncedInheritance":
            kinderUnder18ArraySchema.element.shape.hasRenouncedInheritance,
        },
      },
      "sorgerecht-person": {
        pageSchema: {
          "kinderUnder18#vornameSorgerecht":
            kinderUnder18ArraySchema.element.shape.vornameSorgerecht,
          "kinderUnder18#nachnameSorgerecht":
            kinderUnder18ArraySchema.element.shape.nachnameSorgerecht,
          "kinderUnder18#geburtsnameSorgerecht":
            kinderUnder18ArraySchema.element.shape.geburtsnameSorgerecht,
        },
      },
      "sorgerecht-gleiche-address": {
        pageSchema: {
          "kinderUnder18#hasSorgerechtSameAddress":
            kinderUnder18ArraySchema.element.shape.hasSorgerechtSameAddress,
        },
      },
      "sorgerecht-adresse": {
        pageSchema: {
          "kinderUnder18#strasseSorgerecht":
            kinderUnder18ArraySchema.element.shape.strasseSorgerecht,
          "kinderUnder18#hausnummerSorgerecht":
            kinderUnder18ArraySchema.element.shape.hausnummerSorgerecht,
          "kinderUnder18#plzSorgerecht":
            kinderUnder18ArraySchema.element.shape.plzSorgerecht,
          "kinderUnder18#ortSorgerecht":
            kinderUnder18ArraySchema.element.shape.ortSorgerecht,
          "kinderUnder18#adresseZusatzSorgerecht":
            kinderUnder18ArraySchema.element.shape.adresseZusatzSorgerecht,
        },
      },
      "sorgerecht-organisation-name": {
        pageSchema: {
          "kinderUnder18#organizationNameSorgerecht":
            kinderUnder18ArraySchema.element.shape.organizationNameSorgerecht,
        },
      },
      "sorgerecht-organisation-adresse": {
        pageSchema: {
          "kinderUnder18#organizationStrasseSorgerecht":
            kinderUnder18ArraySchema.element.shape
              .organizationStrasseSorgerecht,
          "kinderUnder18#organizationHausnummerSorgerecht":
            kinderUnder18ArraySchema.element.shape
              .organizationHausnummerSorgerecht,
          "kinderUnder18#organizationPlzSorgerecht":
            kinderUnder18ArraySchema.element.shape.organizationPlzSorgerecht,
          "kinderUnder18#organizationOrtSorgerecht":
            kinderUnder18ArraySchema.element.shape.organizationOrtSorgerecht,
          "kinderUnder18#organizationAdressZusatzSorgerecht":
            kinderUnder18ArraySchema.element.shape
              .organizationAdressZusatzSorgerecht,
        },
      },
    },
  },
  abgabeWeitereInformation: {
    stepId: "abgabe/weitere-informationen",
    pageSchema: {
      weitereInformationen: stringOptionalSchema,
    },
  },
} as const satisfies PagesConfig;

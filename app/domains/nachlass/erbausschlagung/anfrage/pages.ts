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

const kinderArraySchema = z.array(
  z
    .object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      geburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
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
  awarenessDate: {
    stepId: "ausschlagende-person/kenntnisdatum",
    pageSchema: {
      awarenessDate: createSplitDateSchema({
        latest: () => today(),
      }),
      awarenessDateRemarks: stringOptionalSchema,
    },
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
        "not-related",
        "wife-husband",
        "life-partner",
        "daughter-son",
        "granddaughter-grandson",
        "mother-father",
        "sister-brother",
        "half-sister-half-brother",
        "niece-nephew",
        "grandmother-grandfather",
        "aunt-uncle",
        "cousin",
        "great-grandmother-great-grandfather",
        "great-aunt-great-uncle",
        "adoptive-mother-adoptive-father",
        "adoptive-daughter-adoptive-son",
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
  kinderUebersicht: {
    stepId: "kinder/uebersicht",
  },
  kinderWarnung: {
    stepId: "kinder/warnung",
  },
  kinderWarnungNichtAusgefuellt: {
    stepId: "kinder/warnung-nicht-ausgefuellt",
  },
  kinder: {
    stepId: "kinder/kinder",
    pageSchema: {
      kinder: kinderArraySchema,
    },
    arrayPages: {
      name: {
        pageSchema: {
          "kinder#vorname": kinderArraySchema.element.shape.vorname,
          "kinder#nachname": kinderArraySchema.element.shape.nachname,
          "kinder#geburtsdatum": kinderArraySchema.element.shape.geburtsdatum,
        },
      },
      wohnort: {
        pageSchema: {
          "kinder#wohnortBeiAntragsteller":
            kinderArraySchema.element.shape.wohnortBeiAntragsteller,
        },
      },
      adresse: {
        pageSchema: {
          "kinder#strasse": kinderArraySchema.element.shape.strasse,
          "kinder#hausnummer": kinderArraySchema.element.shape.hausnummer,
          "kinder#plz": kinderArraySchema.element.shape.plz,
          "kinder#ort": kinderArraySchema.element.shape.ort,
          "kinder#adresseZusatz": kinderArraySchema.element.shape.adresseZusatz,
        },
      },
      "adresse-optional": {
        pageSchema: {
          "kinder#strasse": stringOptionalSchema,
          "kinder#hausnummer": germanHouseNumberSchema.optional(),
          "kinder#plz": postcodeSchema.optional(),
          "kinder#ort": stringOptionalSchema,
          "kinder#adresseZusatz": stringOptionalSchema,
        },
      },
      sorgerecht: {
        pageSchema: {
          "kinder#optionSorgerecht":
            kinderArraySchema.element.shape.optionSorgerecht,
        },
      },
      "erbe-ausschlagende": {
        pageSchema: {
          "kinder#hasRenouncedInheritance":
            kinderArraySchema.element.shape.hasRenouncedInheritance,
        },
      },
      "sorgerecht-person": {
        pageSchema: {
          "kinder#vornameSorgerecht":
            kinderArraySchema.element.shape.vornameSorgerecht,
          "kinder#nachnameSorgerecht":
            kinderArraySchema.element.shape.nachnameSorgerecht,
          "kinder#geburtsnameSorgerecht":
            kinderArraySchema.element.shape.geburtsnameSorgerecht,
        },
      },
      "sorgerecht-gleiche-adresse": {
        pageSchema: {
          "kinder#hasSorgerechtSameAddress":
            kinderArraySchema.element.shape.hasSorgerechtSameAddress,
        },
      },
      "sorgerecht-adresse": {
        pageSchema: {
          "kinder#strasseSorgerecht":
            kinderArraySchema.element.shape.strasseSorgerecht,
          "kinder#hausnummerSorgerecht":
            kinderArraySchema.element.shape.hausnummerSorgerecht,
          "kinder#plzSorgerecht": kinderArraySchema.element.shape.plzSorgerecht,
          "kinder#ortSorgerecht": kinderArraySchema.element.shape.ortSorgerecht,
          "kinder#adresseZusatzSorgerecht":
            kinderArraySchema.element.shape.adresseZusatzSorgerecht,
        },
      },
      "sorgerecht-organisation-name": {
        pageSchema: {
          "kinder#organizationNameSorgerecht":
            kinderArraySchema.element.shape.organizationNameSorgerecht,
        },
      },
      "sorgerecht-organisation-adresse": {
        pageSchema: {
          "kinder#organizationStrasseSorgerecht":
            kinderArraySchema.element.shape.organizationStrasseSorgerecht,
          "kinder#organizationHausnummerSorgerecht":
            kinderArraySchema.element.shape.organizationHausnummerSorgerecht,
          "kinder#organizationPlzSorgerecht":
            kinderArraySchema.element.shape.organizationPlzSorgerecht,
          "kinder#organizationOrtSorgerecht":
            kinderArraySchema.element.shape.organizationOrtSorgerecht,
          "kinder#organizationAdressZusatzSorgerecht":
            kinderArraySchema.element.shape.organizationAdressZusatzSorgerecht,
        },
      },
    },
  },
  abgabeWeitereInformation: {
    stepId: "abgabe/weitere-informationen",
    pageSchema: {
      weitereInformationen: schemaOrEmptyString(stringRequiredSchema),
    },
  },
  abgabeZusammenfassung: {
    stepId: "abgabe/zusammenfassung",
  },
  abgabeEnde: {
    stepId: "abgabe/ende",
  },
} as const satisfies PagesConfig;

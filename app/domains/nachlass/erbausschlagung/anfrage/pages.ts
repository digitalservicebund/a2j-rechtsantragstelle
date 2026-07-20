import { z } from "zod";
import {
  commonErbausschlagungKinderFields,
  erbausschlagungKinderArraySchema,
  sorgerechtOrganizationRequired,
  sorgerechtPersonAdresseRequired,
  sorgerechtPersonRequired,
} from "~/domains/nachlass/erbausschlagung/anfrage/kinder/pages";
import type { PagesConfig } from "~/domains/pageSchemas";
import { autoSuggestSchema } from "~/services/validation/autoSuggest";
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
      verstorbeneAdresseStrasse: autoSuggestSchema("streetNames"),
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
      ausschlagendePersonStrasse: autoSuggestSchema("streetNames"),
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
      kinder: erbausschlagungKinderArraySchema,
    },
    arrayPages: {
      name: {
        pageSchema: {
          "kinder#vorname": commonErbausschlagungKinderFields.vorname,
          "kinder#nachname": commonErbausschlagungKinderFields.nachname,
          "kinder#geburtsdatum": commonErbausschlagungKinderFields.geburtsdatum,
        },
      },
      wohnort: {
        pageSchema: {
          "kinder#wohnortBeiAntragsteller":
            commonErbausschlagungKinderFields.wohnortBeiAntragsteller,
        },
      },
      adresse: {
        pageSchema: {
          "kinder#strasse": stringRequiredSchema,
          "kinder#hausnummer": germanHouseNumberSchema,
          "kinder#plz": postcodeSchema,
          "kinder#ort": stringRequiredSchema,
          "kinder#adresseZusatz": stringOptionalSchema,
        },
      },
      "adresse-optional": {
        pageSchema: {
          "kinder#strasse": commonErbausschlagungKinderFields.strasse,
          "kinder#hausnummer": commonErbausschlagungKinderFields.hausnummer,
          "kinder#plz": commonErbausschlagungKinderFields.plz,
          "kinder#ort": commonErbausschlagungKinderFields.ort,
          "kinder#adresseZusatz":
            commonErbausschlagungKinderFields.adresseZusatz,
        },
      },
      sorgerecht: {
        pageSchema: {
          "kinder#optionSorgerecht":
            commonErbausschlagungKinderFields.optionSorgerecht,
        },
      },
      "erbe-ausschlagende": {
        pageSchema: {
          "kinder#hasRenouncedInheritance":
            commonErbausschlagungKinderFields.hasRenouncedInheritance,
        },
      },
      "sorgerecht-person": {
        pageSchema: {
          "kinder#vornameSorgerecht":
            sorgerechtPersonRequired.vornameSorgerecht,
          "kinder#nachnameSorgerecht":
            sorgerechtPersonRequired.nachnameSorgerecht,
          "kinder#geburtsnameSorgerecht":
            sorgerechtPersonRequired.geburtsnameSorgerecht,
        },
      },
      "sorgerecht-gleiche-adresse": {
        pageSchema: {
          "kinder#hasSorgerechtSameAddress":
            commonErbausschlagungKinderFields.hasSorgerechtSameAddress,
        },
      },
      "sorgerecht-adresse": {
        pageSchema: {
          "kinder#strasseSorgerecht":
            sorgerechtPersonAdresseRequired.strasseSorgerecht,
          "kinder#hausnummerSorgerecht":
            sorgerechtPersonAdresseRequired.hausnummerSorgerecht,
          "kinder#plzSorgerecht": sorgerechtPersonAdresseRequired.plzSorgerecht,
          "kinder#ortSorgerecht": sorgerechtPersonAdresseRequired.ortSorgerecht,
          "kinder#adresseZusatzSorgerecht":
            sorgerechtPersonAdresseRequired.adresseZusatzSorgerecht,
        },
      },
      "sorgerecht-organisation-name": {
        pageSchema: {
          "kinder#organizationNameSorgerecht":
            commonErbausschlagungKinderFields.organizationNameSorgerecht,
        },
      },
      "sorgerecht-organisation-adresse": {
        pageSchema: {
          "kinder#organizationStrasseSorgerecht":
            sorgerechtOrganizationRequired.organizationStrasseSorgerecht,
          "kinder#organizationHausnummerSorgerecht":
            sorgerechtOrganizationRequired.organizationHausnummerSorgerecht,
          "kinder#organizationPlzSorgerecht":
            sorgerechtOrganizationRequired.organizationPlzSorgerecht,
          "kinder#organizationOrtSorgerecht":
            sorgerechtOrganizationRequired.organizationOrtSorgerecht,
          "kinder#organizationAdressZusatzSorgerecht":
            sorgerechtOrganizationRequired.organizationAdressZusatzSorgerecht,
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

import { z } from "zod";
import { relationshipToDeceasedSchema } from "~/domains/nachlass/shared/schemas";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { autoSuggestStringRequiredSchema } from "~/services/validation/autoSuggest";
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
import {
  erbausschlagungKinderArraySchema,
  commonErbausschlagungKinderFields,
  sorgerechtPersonRequired,
  sorgerechtPersonAdresseRequired,
  sorgerechtOrganizationRequired,
} from "./kinder/schema";

export const nachlassErbausschlagungAnfragePages = {
  start: {
    stepId: "/start/start",
  },
  datenverarbeitung: {
    stepId: "/start/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  verstorbeneName: {
    stepId: "/verstorbene/name",
    pageSchema: {
      verstorbeneVorname: stringRequiredSchema,
      verstorbeneNachname: stringRequiredSchema,
      verstorbeneGeburtsname: stringOptionalSchema,
    },
  },
  verstorbeneNotification: {
    stepId: "/verstorbene/benachrichtigung",
    pageSchema: {
      verstorbeneNotification: z.enum(["yes", "no"]),
    },
  },
  verstorbeneCase: {
    stepId: "/verstorbene/fallbezug",
    pageSchema: {
      nachlassgericht: stringRequiredSchema,
      aktenzeichen: stringRequiredSchema,
    },
  },
  verstorbeneGeburtsdatum: {
    stepId: "/verstorbene/geburtsdatum",
    pageSchema: {
      verstorbeneGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  verstorbeneSterbedatum: {
    stepId: "/verstorbene/sterbedatum",
    pageSchema: {
      verstorbeneSterbedatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  verstorbeneLebensmittelpunkt: {
    stepId: "/verstorbene/lebensmittelpunkt",
    pageSchema: {
      verstorbeneLebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  pflegeheim: {
    stepId: "/verstorbene/pflegeheim",
    pageSchema: {
      livedInNursingHome: YesNoAnswer,
    },
  },
  hospiz: {
    stepId: "/verstorbene/hospiz",
    pageSchema: {
      livedInHospice: YesNoAnswer,
    },
  },
  plzBeforeHospiz: {
    stepId: "/verstorbene/plz-vor-hospiz",
    pageSchema: {
      plzBeforeHospiz: postcodeSchema,
    },
  },
  pflegeheimPLZ: {
    stepId: "/verstorbene/pflegeheim-plz",
    pageSchema: {
      plzPflegeheim: postcodeSchema,
    },
  },
  verstorbenePlz: {
    stepId: "/verstorbene/plz",
    pageSchema: {
      plzVerstorbene: postcodeSchema,
    },
  },
  verstorbeneAdresse: {
    stepId: "/verstorbene/adresse",
    pageSchema: {
      verstorbeneAdresseStrasse: autoSuggestStringRequiredSchema("streetNames"),
      verstorbeneAdresseHausnummer: germanHouseNumberSchema,
      verstorbeneAdresseOrt: stringRequiredSchema,
      verstorbeneAdresseZusatz: stringOptionalSchema,
    },
  },
  verstorbeneAuslaendischeAdresse: {
    stepId: "/verstorbene/auslaendische-adresse",
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
    stepId: "/ausschlagende-person/kenntnisdatum",
    pageSchema: {
      awarenessDate: createSplitDateSchema({
        latest: () => today(),
      }),
      awarenessDateRemarks: stringOptionalSchema,
    },
  },
  ausschlagendePersonName: {
    stepId: "/ausschlagende-person/name",
    pageSchema: {
      ausschlagendePersonVorname: stringRequiredSchema,
      ausschlagendePersonNachname: stringRequiredSchema,
      ausschlagendePersonGeburtsname: stringOptionalSchema,
    },
  },
  ausschlagendePersonPlz: {
    stepId: "/ausschlagende-person/plz",
    pageSchema: {
      ausschlagendePersonPlz: postcodeSchema,
    },
  },
  ausschlagendePersonAdresse: {
    stepId: "/ausschlagende-person/adresse",
    pageSchema: {
      ausschlagendePersonStrasse:
        autoSuggestStringRequiredSchema("streetNames"),
      ausschlagendePersonHausnummer: germanHouseNumberSchema,
      ausschlagendePersonOrt: stringRequiredSchema,
      ausschlagendePersonZusatz: stringOptionalSchema,
    },
  },
  ausschlagendePersonContact: {
    stepId: "/ausschlagende-person/kontakt",
    pageSchema: {
      ausschlagendePersonTelefon: phoneNumberSchema,
      ausschlagendePersonEmail: schemaOrEmptyString(emailSchema),
    },
  },
  ausschlagendePersonBirthday: {
    stepId: "/ausschlagende-person/geburtsdatum",
    pageSchema: {
      ausschlagendePersonGeburtsdatum: createSplitDateSchema({
        earliest: () => addYears(today(), -150),
        latest: () => today(),
      }),
    },
  },
  ausschlagendePersonRelationToErblasser: {
    stepId: "/ausschlagende-person/beziehung-zum-erblasser",
    pageSchema: {
      ausschlagendePersonBeziehungZumErblasser: relationshipToDeceasedSchema,
    },
  },
  kinderHasKid: {
    stepId: "/kinder/haben-sie-kinder",
    pageSchema: {
      hasKid: YesNoAnswer,
    },
  },
  kinderHowManyKids: {
    stepId: "/kinder/wie-viele-kinder",
    pageSchema: {
      numberOfKids: createNumberIncrementSchema(1, 20),
    },
  },
  kinderUebersicht: {
    stepId: "/kinder/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "kinder",
      schema: erbausschlagungKinderArraySchema,
      hiddenFields: ["geburtsnameSorgerecht"],
      isArrayRelevant: (data) => data.hasKid === "yes",
    },
  },

  kinderWarnung: {
    stepId: "/kinder/warnung",
  },

  kinderWarnungNichtAusgefuellt: {
    stepId: "/kinder/warnung-nicht-ausgefuellt",
  },

  kinderName: {
    stepId: "/kinder/kinder/#/name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#vorname": commonErbausschlagungKinderFields.vorname,
      "kinder#nachname": commonErbausschlagungKinderFields.nachname,
      "kinder#geburtsdatum": commonErbausschlagungKinderFields.geburtsdatum,
    },
  },
  kinderWohnort: {
    stepId: "/kinder/kinder/#/wohnort",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#wohnortBeiAntragsteller":
        commonErbausschlagungKinderFields.wohnortBeiAntragsteller,
    },
  },
  kinderAdresse: {
    stepId: "/kinder/kinder/#/adresse",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#strasse": stringRequiredSchema,
      "kinder#hausnummer": germanHouseNumberSchema,
      "kinder#plz": postcodeSchema,
      "kinder#ort": stringRequiredSchema,
      "kinder#adresseZusatz": stringOptionalSchema,
    },
  },
  kinderAdresseOptional: {
    stepId: "/kinder/kinder/#/adresse-optional",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#strasse": commonErbausschlagungKinderFields.strasse,
      "kinder#hausnummer": commonErbausschlagungKinderFields.hausnummer,
      "kinder#plz": commonErbausschlagungKinderFields.plz,
      "kinder#ort": commonErbausschlagungKinderFields.ort,
      "kinder#adresseZusatz": commonErbausschlagungKinderFields.adresseZusatz,
    },
  },
  sorgerecht: {
    stepId: "/kinder/kinder/#/sorgerecht",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#optionSorgerecht":
        commonErbausschlagungKinderFields.optionSorgerecht,
    },
  },
  erbeAusschlagende: {
    stepId: "/kinder/kinder/#/erbe-ausschlagende",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#hasRenouncedInheritance":
        commonErbausschlagungKinderFields.hasRenouncedInheritance,
    },
  },
  sorgerechtPerson: {
    stepId: "/kinder/kinder/#/sorgerecht-person",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#vornameSorgerecht": sorgerechtPersonRequired.vornameSorgerecht,
      "kinder#nachnameSorgerecht": sorgerechtPersonRequired.nachnameSorgerecht,
      "kinder#geburtsnameSorgerecht":
        sorgerechtPersonRequired.geburtsnameSorgerecht,
    },
  },
  sorgerechtGleicheAdresse: {
    stepId: "/kinder/kinder/#/sorgerecht-gleiche-adresse",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#hasSorgerechtSameAddress":
        commonErbausschlagungKinderFields.hasSorgerechtSameAddress,
    },
  },
  sorgerechtAdresse: {
    stepId: "/kinder/kinder/#/sorgerecht-adresse",
    shouldCollapseIntoParentNavItem: true,
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
  sorgerechtOrganisationName: {
    stepId: "/kinder/kinder/#/sorgerecht-organisation-name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#organizationNameSorgerecht":
        commonErbausschlagungKinderFields.organizationNameSorgerecht,
    },
  },
  sorgerechtOrganisationAdresse: {
    stepId: "/kinder/kinder/#/sorgerecht-organisation-adresse",
    shouldCollapseIntoParentNavItem: true,
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
  abgabeWeitereInformation: {
    stepId: "/abgabe/weitere-informationen",
    pageSchema: {
      weitereInformationen: schemaOrEmptyString(stringRequiredSchema),
    },
  },
  abgabeZusammenfassung: {
    stepId: "/abgabe/zusammenfassung",
  },
  abgabeBestaetigung: {
    stepId: "/abgabe/bestaetigung",
    pageSchema: {
      erbausschlagungImGerichtErscheinen: checkedRequired,
      erbausschalgungSechsWochenFrist: checkedRequired,
      erbausschlagungDokumentKeinErsatz: checkedRequired,
    },
  },
  abgabeEnde: {
    stepId: "/abgabe/ende",
  },
} as const satisfies PageConfigMap;

export type NachlassErbausschlagungAnfragePages =
  typeof nachlassErbausschlagungAnfragePages;

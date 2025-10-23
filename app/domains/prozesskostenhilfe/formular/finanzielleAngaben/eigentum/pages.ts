import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createYearSchema } from "~/services/validation/year";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

const eigentuemerSchema = z.enum([
  "myself",
  "partner",
  "myselfAndPartner",
  "myselfAndSomeoneElse",
]);

const befristetArtSchema = z.enum([
  "lifeInsurance",
  "buildingSavingsContract",
  "fixedDepositAccount",
]);

export const bankkontenArraySchema = z
  .object({
    bankName: stringRequiredSchema,
    kontostand: buildMoneyValidationSchema({}),
    iban: stringOptionalSchema,
    kontoEigentuemer: eigentuemerSchema,
    kontoDescription: stringOptionalSchema,
  })
  .array()
  .min(1);

const sharedKraftfahrzeugeFields = {
  wert: z.enum(["under10000", "over10000", "unsure"]),
};

export const kraftfahrzeugeArraySchema = z
  .union([
    z.object({
      ...sharedKraftfahrzeugeFields,
      hasArbeitsweg: YesNoAnswer,
      wert: z.literal("under10000"),
    }),
    z.object({
      ...sharedKraftfahrzeugeFields,
      hasArbeitsweg: YesNoAnswer,
      wert: z.enum(["over10000", "unsure"]),
      art: stringRequiredSchema,
      marke: stringRequiredSchema,
      eigentuemer: eigentuemerSchema,
      verkaufswert: schemaOrEmptyString(buildMoneyValidationSchema()),
      kilometerstand: integerSchema,
      anschaffungsjahr: schemaOrEmptyString(
        createYearSchema({
          optional: true,
          latest: () => today().getFullYear(),
        }),
      ),
      baujahr: schemaOrEmptyString(
        createYearSchema({ latest: () => today().getFullYear() }),
      ),
    }),
  ])
  .array()
  .min(1);

const sharedGeldanlagenFields = {
  art: z.enum([
    "bargeld",
    "wertpapiere",
    "guthabenkontoKrypto",
    "giroTagesgeldSparkonto",
    "befristet",
    "forderung",
    "sonstiges",
  ]),
  eigentuemer: eigentuemerSchema,
  wert: buildMoneyValidationSchema(),
};

export const geldanlagenArraySchema = z
  .union([
    z.object({
      ...sharedGeldanlagenFields,
      art: z.enum(["bargeld", "wertpapiere", "guthabenkontoKrypto"]),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("giroTagesgeldSparkonto"),
      kontoBankName: stringOptionalSchema,
      kontoIban: stringOptionalSchema,
      kontoBezeichnung: stringOptionalSchema,
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("befristet"),
      befristetArt: befristetArtSchema,
      verwendungszweck: stringOptionalSchema,
      auszahlungdatum: stringOptionalSchema,
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("forderung"),
      forderung: stringOptionalSchema,
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("sonstiges"),
      verwendungszweck: stringOptionalSchema,
    }),
  ])
  .array()
  .min(1);

const sharedGrundeigentumFields = {
  isBewohnt: z.enum(["yes", "no", "family"]),
  art: z.enum([
    "eigentumswohnung",
    "einfamilienhaus",
    "mehrereWohnungen",
    "unbebaut",
    "erbbaurecht",
    "garage",
  ]),
  eigentuemer: eigentuemerSchema,
  flaeche: stringRequiredSchema,
  verkaufswert: buildMoneyValidationSchema(),
};
export const grundeigentumArraySchema = z
  .union([
    z.object({
      ...sharedGrundeigentumFields,
      isBewohnt: z.enum(["yes"]),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      isBewohnt: z.enum(["no", "family"]),
      strassehausnummer: stringRequiredSchema,
      plz: stringOptionalSchema,
      ort: stringRequiredSchema,
      land: stringRequiredSchema,
    }),
  ])
  .array()
  .min(1);

export const wertsachenArraySchema = z
  .object({
    art: stringRequiredSchema,
    eigentuemer: eigentuemerSchema,
    wert: buildMoneyValidationSchema(),
  })
  .array()
  .min(1);

export const pkhFormularFinanzielleAngabenEigentumPages = {
  eigentumInfo: {
    stepId: "finanzielle-angaben/eigentum/eigentum-info",
  },
  eigentumHeiratInfo: {
    stepId: "finanzielle-angaben/eigentum/heirat-info",
  },
  eigentumBankkontenFrage: {
    stepId: "finanzielle-angaben/eigentum/bankkonten-frage",
    pageSchema: {
      hasBankkonto: YesNoAnswer,
    },
  },
  eigentumGeldanlagenFrage: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen-frage",
    pageSchema: {
      hasGeldanlage: YesNoAnswer,
    },
  },
  eigentumWertgegenstaendeFrage: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende-frage",
    pageSchema: {
      hasWertsache: YesNoAnswer,
    },
  },
  eigentumGrundeigentumFrage: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum-frage",
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  eigentumKraftfahrzeugeFrage: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
    pageSchema: {
      hasKraftfahrzeug: YesNoAnswer,
    },
  },
  eigentumZusammenfassung: {
    stepId: "finanzielle-angaben/eigentum-zusammenfassung",
    pageSchema: {
      bankkonten: bankkontenArraySchema,
      kraftfahrzeuge: kraftfahrzeugeArraySchema,
      geldanlagen: geldanlagenArraySchema,
      grundeigentum: grundeigentumArraySchema,
      wertsachen: wertsachenArraySchema,
    },
    arrayPages: {
      bankkonten: {
        arrayPages: {
          daten: {
            pageSchema: {
              "bankkonten#bankName": stringRequiredSchema,
              "bankkonten#kontostand": buildMoneyValidationSchema({}),
              "bankkonten#iban": stringOptionalSchema,
              "bankkonten#kontoEigentuemer": eigentuemerSchema,
              "bankkonten#kontoDescription": stringOptionalSchema,
            },
          },
        },
      },
      kraftfahrzeuge: {
        arrayPages: {
          arbeitsweg: {
            pageSchema: {
              "kraftfahrzeuge#hasArbeitsweg": YesNoAnswer,
            },
          },
          wert: {
            pageSchema: {
              "kraftfahrzeuge#wert": sharedKraftfahrzeugeFields.wert,
            },
          },
          fahrzeuge: {
            pageSchema: {
              "kraftfahrzeuge#art": stringRequiredSchema,
              "kraftfahrzeuge#marke": stringRequiredSchema,
              "kraftfahrzeuge#eigentuemer": eigentuemerSchema,
              "kraftfahrzeuge#verkaufswert": schemaOrEmptyString(
                buildMoneyValidationSchema(),
              ),
              "kraftfahrzeuge#kilometerstand": integerSchema,
              "kraftfahrzeuge#anschaffungsjahr": createYearSchema({
                optional: true,
                latest: () => today().getFullYear(),
              }),
              "kraftfahrzeuge#baujahr": createYearSchema({
                latest: () => today().getFullYear(),
              }),
            },
          },
        },
      },
      geldanlagen: {
        arrayPages: {
          art: {
            pageSchema: {
              "geldanlagen#art": sharedGeldanlagenFields.art,
            },
          },
          bargeld: {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
            },
          },
          wertpapiere: {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
            },
          },
          "guthabenkonto-krypto": {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
            },
          },
          "giro-tagesgeld-sparkonto": {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
              "geldanlagen#kontoBankName": stringOptionalSchema,
              "geldanlagen#kontoIban": stringOptionalSchema,
              "geldanlagen#kontoBezeichnung": stringOptionalSchema,
            },
          },
          befristet: {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
              "geldanlagen#befristetArt": befristetArtSchema,
              "geldanlagen#verwendungszweck": stringOptionalSchema,
              "geldanlagen#auszahlungdatum": stringOptionalSchema,
            },
          },
          forderung: {
            pageSchema: {
              "geldanlagen#forderung": stringOptionalSchema,
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
            },
          },
          sonstiges: {
            pageSchema: {
              "geldanlagen#verwendungszweck": stringOptionalSchema,
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": buildMoneyValidationSchema(),
            },
          },
        },
      },
      grundeigentum: {
        arrayPages: {
          "bewohnt-frage": {
            pageSchema: {
              "grundeigentum#isBewohnt": sharedGrundeigentumFields.isBewohnt,
            },
          },
          daten: {
            pageSchema: {
              "grundeigentum#art": sharedGrundeigentumFields.art,
              "grundeigentum#eigentuemer": eigentuemerSchema,
              "grundeigentum#flaeche": stringRequiredSchema,
              "grundeigentum#verkaufswert": buildMoneyValidationSchema(),
              "grundeigentum#strassehausnummer": stringRequiredSchema,
              "grundeigentum#plz": stringOptionalSchema,
              "grundeigentum#ort": stringRequiredSchema,
              "grundeigentum#land": stringRequiredSchema,
            },
          },
          "bewohnt-daten": {
            pageSchema: {
              "grundeigentum#art": sharedGrundeigentumFields.art,
              "grundeigentum#eigentuemer": eigentuemerSchema,
              "grundeigentum#flaeche": stringRequiredSchema,
              "grundeigentum#verkaufswert": buildMoneyValidationSchema(),
            },
          },
        },
      },
      wertgegenstaende: {
        arrayPages: {
          daten: {
            pageSchema: {
              "wertsachen#art": stringRequiredSchema,
              "wertsachen#eigentuemer": eigentuemerSchema,
              "wertsachen#wert": buildMoneyValidationSchema(),
            },
          },
        },
      },
    },
  },
  eigentumZusammenfassungWarnung: {
    stepId: "finanzielle-angaben/eigentum-zusammenfassung/warnung",
  },
} as const satisfies PagesConfig;

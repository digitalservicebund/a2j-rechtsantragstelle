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
  hasArbeitsweg: YesNoAnswer,
};

const kraftfahrzeugWertSchema = z.enum(["under10000", "over10000", "unsure"]);

const kraftfahrzeugOver10000OrUnsureSchema = z.object({
  ...sharedKraftfahrzeugeFields,
  wert: z.enum([
    kraftfahrzeugWertSchema.def.entries.over10000,
    kraftfahrzeugWertSchema.def.entries.unsure,
  ]),
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
});

export const kraftfahrzeugeArraySchema = z
  .union([
    z.object({
      ...sharedKraftfahrzeugeFields,
      wert: z.literal(kraftfahrzeugWertSchema.def.entries.under10000),
    }),
    kraftfahrzeugOver10000OrUnsureSchema,
  ])
  .array()
  .min(1);

const geldanlagenArtSchema = z.enum([
  "bargeld",
  "wertpapiere",
  "guthabenkontoKrypto",
  "giroTagesgeldSparkonto",
  "befristet",
  "forderung",
  "sonstiges",
]);

const sharedGeldanlagenFields = {
  eigentuemer: eigentuemerSchema,
  wert: buildMoneyValidationSchema(),
};

const sparkontoSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal(geldanlagenArtSchema.enum.giroTagesgeldSparkonto),
  kontoBankName: stringRequiredSchema,
  kontoIban: stringOptionalSchema,
  kontoBezeichnung: stringOptionalSchema,
});

const befristetSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal(geldanlagenArtSchema.enum.befristet),
  befristetArt: z.enum([
    "lifeInsurance",
    "buildingSavingsContract",
    "fixedDepositAccount",
  ]),
  verwendungszweck: stringOptionalSchema,
  auszahlungdatum: stringOptionalSchema,
});

const forderungSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal(geldanlagenArtSchema.enum.forderung),
  forderung: stringOptionalSchema,
});

const sonstigesSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal(geldanlagenArtSchema.enum.sonstiges),
  verwendungszweck: stringOptionalSchema,
});

export const geldanlagenArraySchema = z
  .union([
    z.object({
      ...sharedGeldanlagenFields,
      art: z.enum([
        geldanlagenArtSchema.enum.bargeld,
        geldanlagenArtSchema.enum.wertpapiere,
        geldanlagenArtSchema.enum.guthabenkontoKrypto,
      ]),
    }),
    sparkontoSchema,
    befristetSchema,
    forderungSchema,
    sonstigesSchema,
  ])
  .array()
  .min(1);

const grundeigentumIsBewohntSchema = z.enum(["yes", "no", "family"]);
const sharedGrundeigentumFields = {
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

const grundeigentumNotLivedInSchema = {
  ...sharedGrundeigentumFields,
  isBewohnt: z.enum([
    grundeigentumIsBewohntSchema.enum.no,
    grundeigentumIsBewohntSchema.enum.family,
  ]),
  strassehausnummer: stringRequiredSchema,
  plz: stringOptionalSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
};

export const grundeigentumArraySchema = z
  .union([
    z.object({
      ...sharedGrundeigentumFields,
      isBewohnt: z.literal(grundeigentumIsBewohntSchema.enum.yes),
    }),
    z.object(grundeigentumNotLivedInSchema),
  ])
  .array()
  .min(1);

export const wertsacheSchema = z.object({
  art: stringRequiredSchema,
  eigentuemer: eigentuemerSchema,
  wert: buildMoneyValidationSchema(),
});

export const wertsachenArraySchema = z.array(wertsacheSchema).min(1);

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
            pageSchema: { "kraftfahrzeuge#hasArbeitsweg": YesNoAnswer },
          },
          wert: {
            pageSchema: { "kraftfahrzeuge#wert": kraftfahrzeugWertSchema },
          },
          fahrzeuge: {
            pageSchema: {
              "kraftfahrzeuge#art":
                kraftfahrzeugOver10000OrUnsureSchema.shape.art,
              "kraftfahrzeuge#marke":
                kraftfahrzeugOver10000OrUnsureSchema.shape.marke,
              "kraftfahrzeuge#eigentuemer":
                kraftfahrzeugOver10000OrUnsureSchema.shape.eigentuemer,
              "kraftfahrzeuge#verkaufswert":
                kraftfahrzeugOver10000OrUnsureSchema.shape.verkaufswert,
              "kraftfahrzeuge#kilometerstand":
                kraftfahrzeugOver10000OrUnsureSchema.shape.kilometerstand,
              "kraftfahrzeuge#anschaffungsjahr":
                kraftfahrzeugOver10000OrUnsureSchema.shape.anschaffungsjahr,
              "kraftfahrzeuge#baujahr":
                kraftfahrzeugOver10000OrUnsureSchema.shape.baujahr,
            },
          },
        },
      },
      geldanlagen: {
        arrayPages: {
          art: {
            pageSchema: { "geldanlagen#art": geldanlagenArtSchema },
          },
          bargeld: {
            pageSchema: {
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          wertpapiere: {
            pageSchema: {
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          "guthabenkonto-krypto": {
            pageSchema: {
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          "giro-tagesgeld-sparkonto": {
            pageSchema: {
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
              "geldanlagen#kontoBankName": sparkontoSchema.shape.kontoBankName,
              "geldanlagen#kontoIban": sparkontoSchema.shape.kontoIban,
              "geldanlagen#kontoBezeichnung":
                sparkontoSchema.shape.kontoBezeichnung,
            },
          },
          befristet: {
            pageSchema: {
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
              "geldanlagen#befristetArt": befristetSchema.shape.befristetArt,
              "geldanlagen#verwendungszweck":
                befristetSchema.shape.verwendungszweck,
              "geldanlagen#auszahlungdatum":
                befristetSchema.shape.auszahlungdatum,
            },
          },
          forderung: {
            pageSchema: {
              "geldanlagen#forderung": forderungSchema.shape.forderung,
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          sonstiges: {
            pageSchema: {
              "geldanlagen#verwendungszweck":
                sonstigesSchema.shape.verwendungszweck,
              "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
        },
      },
      grundeigentum: {
        arrayPages: {
          "bewohnt-frage": {
            pageSchema: {
              "grundeigentum#isBewohnt": grundeigentumIsBewohntSchema,
            },
          },
          daten: {
            pageSchema: {
              "grundeigentum#art": sharedGrundeigentumFields.art,
              "grundeigentum#eigentuemer":
                sharedGrundeigentumFields.eigentuemer,
              "grundeigentum#flaeche": sharedGrundeigentumFields.flaeche,
              "grundeigentum#verkaufswert":
                sharedGrundeigentumFields.verkaufswert,
              "grundeigentum#strassehausnummer":
                grundeigentumNotLivedInSchema.strassehausnummer,
              "grundeigentum#plz": grundeigentumNotLivedInSchema.plz,
              "grundeigentum#ort": grundeigentumNotLivedInSchema.ort,
              "grundeigentum#land": grundeigentumNotLivedInSchema.land,
            },
          },
          "bewohnt-daten": {
            pageSchema: {
              "grundeigentum#art": sharedGrundeigentumFields.art,
              "grundeigentum#eigentuemer":
                sharedGrundeigentumFields.eigentuemer,
              "grundeigentum#flaeche": sharedGrundeigentumFields.flaeche,
              "grundeigentum#verkaufswert":
                sharedGrundeigentumFields.verkaufswert,
            },
          },
        },
      },
      wertgegenstaende: {
        arrayPages: {
          daten: {
            pageSchema: {
              "wertsachen#art": wertsacheSchema.shape.art,
              "wertsachen#eigentuemer": wertsacheSchema.shape.eigentuemer,
              "wertsachen#wert": wertsacheSchema.shape.wert,
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

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

const kraftfahrzeugWertSchema = z.enum(["under10000", "over10000", "unsure"]);

const grundeigentumArtSchema = z.enum([
  "eigentumswohnung",
  "einfamilienhaus",
  "mehrereWohnungen",
  "unbebaut",
  "erbbaurecht",
  "garage",
]);

const geldanlagenArtSchema = z.enum([
  "bargeld",
  "wertpapiere",
  "guthabenkontoKrypto",
  "giroTagesgeldSparkonto",
  "befristet",
  "forderung",
  "sonstiges",
]);

const befristetArtSchema = z.enum([
  "lifeInsurance",
  "buildingSavingsContract",
  "fixedDepositAccount",
]);

const bewohntSchema = z.enum(["yes", "family", "no"]);

const sharedBankkontenFields = {
  bankName: stringRequiredSchema,
  kontostand: buildMoneyValidationSchema({}),
  iban: stringOptionalSchema,
  kontoEigentuemer: eigentuemerSchema,
  kontoDescription: stringOptionalSchema,
};

const bankkontenArraySchema = z
  .union([
    z.object({
      ...sharedBankkontenFields,
      kontoEigentuemer: z.literal("myself"),
    }),
    z.object({
      ...sharedBankkontenFields,
      kontoEigentuemer: z.literal("partner"),
    }),
    z.object({
      ...sharedBankkontenFields,
      kontoEigentuemer: z.literal("myselfAndPartner"),
    }),
    z.object({
      ...sharedBankkontenFields,
      kontoEigentuemer: z.literal("myselfAndSomeoneElse"),
    }),
  ])
  .array()
  .min(1);

const sharedKraftfahrzeugeFields = {
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
  hasArbeitsweg: YesNoAnswer,
  wert: kraftfahrzeugWertSchema,
};

const kraftfahrzeugeArraySchema = z
  .union([
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        kontoEigentuemer: z.literal("myself"),
      })
      .partial(),
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        kontoEigentuemer: z.literal("partner"),
      })
      .partial(),
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        kontoEigentuemer: z.literal("myselfAndPartner"),
      })
      .partial(),
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        kontoEigentuemer: z.literal("myselfAndSomeoneElse"),
      })
      .partial(),
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        wert: z.literal("under10000"),
      })
      .partial(),
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        wert: z.literal("over10000"),
      })
      .partial(),
    z
      .object({
        ...sharedKraftfahrzeugeFields,
        wert: z.literal("unsure"),
      })
      .partial(),
  ])
  .array()
  .min(1);

const sharedGeldanlagenFields = {
  art: geldanlagenArtSchema,
  eigentuemer: eigentuemerSchema,
  wert: buildMoneyValidationSchema(),
  kontoBankName: stringOptionalSchema,
  kontoIban: stringOptionalSchema,
  kontoBezeichnung: stringOptionalSchema,
  befristetArt: befristetArtSchema.optional(),
  forderung: stringOptionalSchema,
  verwendungszweck: stringOptionalSchema,
  auszahlungdatum: stringOptionalSchema,
};

const geldanlagenArraySchema = z
  .union([
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("bargeld"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("wertpapiere"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("guthabenkontoKrypto"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("giroTagesgeldSparkonto"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("befristet"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("forderung"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      art: z.literal("sonstiges"),
    }),
    z.object({ ...sharedGeldanlagenFields, eigentuemer: z.literal("myself") }),
    z.object({ ...sharedGeldanlagenFields, eigentuemer: z.literal("partner") }),
    z.object({
      ...sharedGeldanlagenFields,
      eigentuemer: z.literal("myselfAndPartner"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      eigentuemer: z.literal("myselfAndSomeoneElse"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      befristetArt: z.literal("lifeInsurance"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      befristetArt: z.literal("buildingSavingsContract"),
    }),
    z.object({
      ...sharedGeldanlagenFields,
      befristetArt: z.literal("fixedDepositAccount"),
    }),
  ])
  .array()
  .min(1);

const sharedGrundeigentumFields = {
  isBewohnt: bewohntSchema,
  art: grundeigentumArtSchema,
  eigentuemer: eigentuemerSchema,
  flaeche: stringRequiredSchema,
  verkaufswert: buildMoneyValidationSchema(),
  strassehausnummer: stringRequiredSchema,
  plz: stringOptionalSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
};

const grundeigentumArraySchema = z
  .union([
    z.object({
      ...sharedGrundeigentumFields,
      isBewohnt: z.literal("yes"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      isBewohnt: z.literal("family"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      isBewohnt: z.literal("no"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      art: z.literal("eigentumswohnung"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      art: z.literal("einfamilienhaus"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      art: z.literal("mehrereWohnungen"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      art: z.literal("unbebaut"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      art: z.literal("erbbaurecht"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      art: z.literal("garage"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      eigentuemer: z.literal("myself"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      eigentuemer: z.literal("partner"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      eigentuemer: z.literal("myselfAndPartner"),
    }),
    z.object({
      ...sharedGrundeigentumFields,
      eigentuemer: z.literal("myselfAndSomeoneElse"),
    }),
  ])
  .array()
  .min(1);

const sharedWertsachenFields = {
  art: stringRequiredSchema,
  eigentuemer: eigentuemerSchema,
  wert: buildMoneyValidationSchema(),
};

const wertsachenArraySchema = z
  .union([
    z.object({ ...sharedWertsachenFields, eigentuemer: z.literal("myself") }),
    z.object({ ...sharedWertsachenFields, eigentuemer: z.literal("partner") }),
    z.object({
      ...sharedWertsachenFields,
      eigentuemer: z.literal("myselfAndPartner"),
    }),
    z.object({
      ...sharedWertsachenFields,
      eigentuemer: z.literal("myselfAndSomeoneElse"),
    }),
  ])
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
              "bankkonten#bankName": sharedBankkontenFields.bankName,
              "bankkonten#kontostand": sharedBankkontenFields.kontostand,
              "bankkonten#iban": sharedBankkontenFields.iban,
              "bankkonten#kontoEigentuemer": eigentuemerSchema,
              "bankkonten#kontoDescription":
                sharedBankkontenFields.kontoDescription,
            },
          },
        },
      },
      kraftfahrzeuge: {
        arrayPages: {
          arbeitsweg: {
            pageSchema: {
              "kraftfahrzeuge#hasArbeitsweg":
                sharedKraftfahrzeugeFields.hasArbeitsweg,
            },
          },
          wert: {
            pageSchema: {
              "kraftfahrzeuge#wert": kraftfahrzeugWertSchema,
            },
          },
          fahrzeuge: {
            pageSchema: {
              "kraftfahrzeuge#art": sharedKraftfahrzeugeFields.art,
              "kraftfahrzeuge#marke": sharedKraftfahrzeugeFields.marke,
              "kraftfahrzeuge#eigentuemer":
                sharedKraftfahrzeugeFields.eigentuemer,
              "kraftfahrzeuge#verkaufswert":
                sharedKraftfahrzeugeFields.verkaufswert,
              "kraftfahrzeuge#kilometerstand":
                sharedKraftfahrzeugeFields.kilometerstand,
              "kraftfahrzeuge#anschaffungsjahr":
                sharedKraftfahrzeugeFields.anschaffungsjahr,
              "kraftfahrzeuge#baujahr": sharedKraftfahrzeugeFields.baujahr,
            },
          },
        },
      },
      geldanlagen: {
        arrayPages: {
          art: {
            pageSchema: {
              "geldanlagen#art": geldanlagenArtSchema,
            },
          },
          bargeld: {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          wertpapiere: {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          "guthabenkonto-krypto": {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          "giro-tagesgeld-sparkonto": {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
              "geldanlagen#kontoBankName":
                sharedGeldanlagenFields.kontoBankName,
              "geldanlagen#kontoIban": sharedGeldanlagenFields.kontoIban,
              "geldanlagen#kontoBezeichnung":
                sharedGeldanlagenFields.kontoBezeichnung,
            },
          },
          befristet: {
            pageSchema: {
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
              "geldanlagen#befristetArt": befristetArtSchema,
              "geldanlagen#verwendungszweck":
                sharedGeldanlagenFields.verwendungszweck,
              "geldanlagen#auszahlungdatum":
                sharedGeldanlagenFields.auszahlungdatum,
            },
          },
          forderung: {
            pageSchema: {
              "geldanlagen#forderung": sharedGeldanlagenFields.forderung,
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
          sonstiges: {
            pageSchema: {
              "geldanlagen#verwendungszweck":
                sharedGeldanlagenFields.verwendungszweck,
              "geldanlagen#eigentuemer": eigentuemerSchema,
              "geldanlagen#wert": sharedGeldanlagenFields.wert,
            },
          },
        },
      },
      grundeigentum: {
        arrayPages: {
          "bewohnt-frage": {
            pageSchema: {
              "grundeigentum#isBewohnt": bewohntSchema,
            },
          },
          daten: {
            pageSchema: {
              "grundeigentum#art": grundeigentumArtSchema,
              "grundeigentum#eigentuemer": eigentuemerSchema,
              "grundeigentum#flaeche": sharedGrundeigentumFields.flaeche,
              "grundeigentum#verkaufswert":
                sharedGrundeigentumFields.verkaufswert,
              "grundeigentum#strassehausnummer":
                sharedGrundeigentumFields.strassehausnummer,
              "grundeigentum#plz": sharedGrundeigentumFields.plz,
              "grundeigentum#ort": sharedGrundeigentumFields.ort,
              "grundeigentum#land": sharedGrundeigentumFields.land,
            },
          },
          "bewohnt-daten": {
            pageSchema: {
              "grundeigentum#art": grundeigentumArtSchema,
              "grundeigentum#eigentuemer": eigentuemerSchema,
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
              "wertsachen#art": sharedWertsachenFields.art,
              "wertsachen#eigentuemer": eigentuemerSchema,
              "wertsachen#wert": sharedWertsachenFields.wert,
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

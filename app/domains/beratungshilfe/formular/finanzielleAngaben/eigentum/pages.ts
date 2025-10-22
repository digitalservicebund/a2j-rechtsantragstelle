import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { bankkontenArraySchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createYearSchema } from "~/services/validation/year";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

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
  eigentuemer: z.enum([
    "myself",
    "partner",
    "myselfAndPartner",
    "myselfAndSomeoneElse",
  ]),
  wert: buildMoneyValidationSchema(),
};

const sparkontoSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal("giroTagesgeldSparkonto"),
  kontoBankName: stringRequiredSchema,
  kontoIban: stringOptionalSchema,
  kontoBezeichnung: stringOptionalSchema,
});

const befristetSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal("befristet"),
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
  art: z.literal("forderung"),
  forderung: stringOptionalSchema,
});

const sonstigesSchema = z.object({
  ...sharedGeldanlagenFields,
  art: z.literal("sonstiges"),
  verwendungszweck: stringOptionalSchema,
});

const sharedKraftfahrzeugFields = {
  hasArbeitsweg: YesNoAnswer,
  wert: z.enum(["under10000", "over10000", "unsure"]),
};

const kraftfahrzeugUnder10000Schema = z.object({
  ...sharedKraftfahrzeugFields,
  wert: z.literal("under10000"),
});

const kraftfahrzeugOver10000OrUnsureSchema = z.object({
  ...sharedKraftfahrzeugFields,
  wert: z.enum(["over10000", "unsure"]),
  art: stringRequiredSchema,
  marke: stringRequiredSchema,
  eigentuemer: z.enum([
    "myself",
    "partner",
    "myselfAndPartner",
    "myselfAndSomeoneElse",
  ]),
  verkaufswert: schemaOrEmptyString(buildMoneyValidationSchema()),
  kilometerstand: integerSchema,
  anschaffungsjahr: createYearSchema({
    optional: true,
    latest: () => today().getFullYear(),
  }),
  baujahr: createYearSchema({
    latest: () => today().getFullYear(),
  }),
});

const sharedEigentumFields = {
  isBewohnt: z.enum(["yes", "family", "no"]),
  art: z.enum([
    "eigentumswohnung",
    "einfamilienhaus",
    "mehrereWohnungen",
    "unbebaut",
    "erbbaurecht",
    "garage",
  ]),
  eigentuemer: z.enum([
    "myself",
    "partner",
    "myselfAndPartner",
    "myselfAndSomeoneElse",
  ]),
  flaeche: stringRequiredSchema,
  verkaufswert: buildMoneyValidationSchema(),
};

export const berhAntragFinanzielleAngabenEigentumPages = {
  eigentumInfo: {
    stepId: "finanzielle-angaben/eigentum/eigentum-info",
  },
  eigentumHeiratInfo: {
    stepId: "finanzielle-angaben/eigentum/heirat-info",
  },
  eigentumBankkonten: {
    stepId: "finanzielle-angaben/eigentum/bankkonten",
  },
  eigentumBankkontenFrage: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
    pageSchema: {
      hasBankkonto: YesNoAnswer,
    },
  },
  eigentumBankkontenUebersicht: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/uebersicht",
  },
  eigentumBankkonto: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/bankkonto",
    pageSchema: { bankkonten: bankkontenArraySchema },
    arrayPages: {
      daten: {
        pageSchema: {
          "bankkonten#kontoEigentuemer":
            bankkontenArraySchema.element.shape.kontoEigentuemer,
          "bankkonten#bankName": bankkontenArraySchema.element.shape.bankName,
          "bankkonten#kontostand":
            bankkontenArraySchema.element.shape.kontostand,
          "bankkonten#iban": bankkontenArraySchema.element.shape.iban,
          "bankkonten#kontoDescription":
            bankkontenArraySchema.element.shape.kontoDescription,
        },
      },
    },
  },
  eigentumBankkontoWarnung: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/warnung",
  },
  eigentumGeldanlagen: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen",
  },
  eigentumGeldanlagenFrage: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
    pageSchema: {
      hasGeldanlage: YesNoAnswer,
    },
  },
  eigentumGeldanlagenUebersicht: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/uebersicht",
  },
  eigentumGeldanlage: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage",
    pageSchema: {
      geldanlagen: z
        .union([
          z.object({
            ...sharedGeldanlagenFields,
          }),
          sparkontoSchema,
          befristetSchema,
          forderungSchema,
          sonstigesSchema,
        ])
        .array()
        .min(1),
    },
    arrayPages: {
      art: {
        pageSchema: {
          "geldanlagen#art": sharedGeldanlagenFields.art,
        },
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
          "geldanlagen#auszahlungdatum": befristetSchema.shape.auszahlungdatum,
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
  eigentumGeldanlagenWarnung: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/warnung",
  },
  eigentumKraftfahrzeuge: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge",
  },
  eigentumKraftfahrzeugeFrage: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
    pageSchema: {
      hasKraftfahrzeug: YesNoAnswer,
    },
  },
  eigentumKraftfahrzeugeUebersicht: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
  },
  eigentumKraftfahrzeug: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug",
    pageSchema: {
      kraftfahrzeuge: z
        .union([
          kraftfahrzeugUnder10000Schema,
          kraftfahrzeugOver10000OrUnsureSchema,
        ])
        .array()
        .min(1),
    },
    arrayPages: {
      arbeitsweg: {
        pageSchema: {
          "kraftfahrzeuge#hasArbeitsweg":
            sharedKraftfahrzeugFields.hasArbeitsweg,
        },
      },
      wert: {
        pageSchema: {
          "kraftfahrzeuge#wert": sharedKraftfahrzeugFields.wert,
        },
      },
      fahrzeuge: {
        pageSchema: {
          "kraftfahrzeuge#art": kraftfahrzeugOver10000OrUnsureSchema.shape.art,
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
  eigentumKraftfahrzeugeWarnung: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/warnung",
  },
  eigentumWertgegenstaende: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende",
  },
  eigentumWertgegenstaendeFrage: {
    stepId:
      "finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
    pageSchema: {
      hasWertsache: YesNoAnswer,
    },
  },
  eigentumWertgegenstaendeUebersicht: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
  },
  eigentumWertgegenstand: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand",
    pageSchema: {
      wertsachen: z.array(
        z.object({
          art: stringRequiredSchema,
          eigentuemer: z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          wert: buildMoneyValidationSchema(),
        }),
      ),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "wertsachen#art": stringRequiredSchema,
          "wertsachen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "wertsachen#wert": buildMoneyValidationSchema(),
        },
      },
    },
  },
  eigentumWertgegenstaendeWarnung: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende/warnung",
  },
  eigentumGrundeigentum: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum",
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  eigentumGrundeigentumFrage: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  eigentumGrundeigentumUebersicht: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/uebersicht",
  },
  eigentumGrundeigentumGrundeigentum: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/grundeigentum",
    pageSchema: {
      grundeigentum: z
        .array(
          z.union([
            z.object({
              ...sharedEigentumFields,
              isBewohnt: z.literal("yes"),
            }),
            z.object({
              ...sharedEigentumFields,
              isBewohnt: z.enum(["family", "no"]),
              strassehausnummer: stringRequiredSchema,
              plz: stringOptionalSchema,
              ort: stringRequiredSchema,
              land: stringRequiredSchema,
            }),
          ]),
        )
        .min(1),
    },
    arrayPages: {
      "bewohnt-frage": {
        pageSchema: {
          "grundeigentum#isBewohnt": sharedEigentumFields.isBewohnt,
        },
      },
      daten: {
        pageSchema: {
          "grundeigentum#art": sharedEigentumFields.art,
          "grundeigentum#eigentuemer": sharedEigentumFields.eigentuemer,
          "grundeigentum#flaeche": sharedEigentumFields.flaeche,
          "grundeigentum#verkaufswert": sharedEigentumFields.verkaufswert,
          "grundeigentum#strassehausnummer": stringRequiredSchema,
          "grundeigentum#plz": stringOptionalSchema,
          "grundeigentum#ort": stringRequiredSchema,
          "grundeigentum#land": stringRequiredSchema,
        },
      },
      "bewohnt-daten": {
        pageSchema: {
          "grundeigentum#art": sharedEigentumFields.art,
          "grundeigentum#eigentuemer": sharedEigentumFields.eigentuemer,
          "grundeigentum#flaeche": sharedEigentumFields.flaeche,
          "grundeigentum#verkaufswert": sharedEigentumFields.verkaufswert,
        },
      },
    },
  },
  eigentumGrundeigentumWarnung: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/warnung",
  },
} as const satisfies PagesConfig;

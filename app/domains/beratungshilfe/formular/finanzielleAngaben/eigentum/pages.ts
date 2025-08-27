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
    pageSchema: {
      bankkonten: z.array(
        z.object({
          bankName: stringRequiredSchema,
          kontostand: buildMoneyValidationSchema({}),
          iban: stringOptionalSchema,
          kontoEigentuemer: z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          kontoDescription: stringOptionalSchema,
        }),
      ),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "bankkonten#bankName": stringRequiredSchema,
          "bankkonten#kontostand": buildMoneyValidationSchema({}),
          "bankkonten#iban": stringOptionalSchema,
          "bankkonten#kontoEigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "bankkonten#kontoDescription": stringOptionalSchema,
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
      geldanlagen: z.array(
        z
          .object({
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
            kontoBankName: stringOptionalSchema,
            kontoIban: stringOptionalSchema,
            kontoBezeichnung: stringOptionalSchema,
            befristetArt: z
              .enum([
                "lifeInsurance",
                "buildingSavingsContract",
                "fixedDepositAccount",
              ])
              .optional(),

            forderung: stringOptionalSchema,
            verwendungszweck: stringOptionalSchema,
            auszahlungdatum: stringOptionalSchema,
          })
          .partial(),
      ),
    },
    arrayPages: {
      art: {
        pageSchema: {
          "geldanlagen#art": z.enum([
            "bargeld",
            "wertpapiere",
            "guthabenkontoKrypto",
            "giroTagesgeldSparkonto",
            "befristet",
            "forderung",
            "sonstiges",
          ]),
        },
      },
      bargeld: {
        pageSchema: {
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
        },
      },
      wertpapiere: {
        pageSchema: {
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
        },
      },
      "guthabenkonto-krypto": {
        pageSchema: {
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
        },
      },
      "giro-tagesgeld-sparkonto": {
        pageSchema: {
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
        },
      },
      befristet: {
        pageSchema: {
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
          "geldanlagen#befristetArt": z
            .enum([
              "lifeInsurance",
              "buildingSavingsContract",
              "fixedDepositAccount",
            ])
            .optional(),
        },
      },
      forderung: {
        pageSchema: {
          "geldanlagen#forderung": stringOptionalSchema,
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
        },
      },
      sonstiges: {
        pageSchema: {
          "geldanlagen#verwendungszweck": stringOptionalSchema,
          "geldanlagen#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "geldanlagen#wert": buildMoneyValidationSchema(),
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
      kraftfahrzeuge: z.array(
        z
          .object({
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
            baujahr: createYearSchema({ latest: () => today().getFullYear() }),
            hasArbeitsweg: YesNoAnswer,
            wert: z.enum(["under10000", "over10000", "unsure"]),
          })
          .partial(),
      ),
    },
    arrayPages: {
      arbeitsweg: {
        pageSchema: {
          "kraftfahrzeuge#hasArbeitsweg": YesNoAnswer,
        },
      },
      wert: {
        pageSchema: {
          "kraftfahrzeuge#wert": z.enum(["under10000", "over10000", "unsure"]),
        },
      },
      fahrzeuge: {
        pageSchema: {
          "kraftfahrzeuge#art": stringRequiredSchema,
          "kraftfahrzeuge#marke": stringRequiredSchema,
          "kraftfahrzeuge#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
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
      grundeigentum: z.array(
        z
          .object({
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
            strassehausnummer: stringRequiredSchema,
            plz: stringOptionalSchema,
            ort: stringRequiredSchema,
            land: stringRequiredSchema,
          })
          .partial(),
      ),
    },
    arrayPages: {
      "bewohnt-frage": {
        pageSchema: {
          "grundeigentum#isBewohnt": z.enum(["yes", "family", "no"]),
        },
      },
      daten: {
        pageSchema: {
          "grundeigentum#art": z.enum([
            "eigentumswohnung",
            "einfamilienhaus",
            "mehrereWohnungen",
            "unbebaut",
            "erbbaurecht",
            "garage",
          ]),
          "grundeigentum#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
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
          "grundeigentum#art": z.enum([
            "eigentumswohnung",
            "einfamilienhaus",
            "mehrereWohnungen",
            "unbebaut",
            "erbbaurecht",
            "garage",
          ]),
          "grundeigentum#eigentuemer": z.enum([
            "myself",
            "partner",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
          "grundeigentum#flaeche": stringRequiredSchema,
          "grundeigentum#verkaufswert": buildMoneyValidationSchema(),
        },
      },
    },
  },
  eigentumGrundeigentumWarnung: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/warnung",
  },
} as const satisfies PagesConfig;

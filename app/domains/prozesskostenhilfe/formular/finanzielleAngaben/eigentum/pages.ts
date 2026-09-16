import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { ibanSchema } from "~/services/validation/iban";
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
    iban: schemaOrEmptyString(ibanSchema),
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
  kontoIban: schemaOrEmptyString(ibanSchema),
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

const wertsachenArraySchema = z.array(wertsacheSchema).min(1);

export const pkhFormularFinanzielleAngabenEigentumPages = {
  eigentumInfo: {
    stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumHeiratInfo: {
    stepId: "/finanzielle-angaben/eigentum/heirat-info",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumBankkonten: {
    stepId: "/finanzielle-angaben/eigentum/bankkonten",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumBankkontenFrage: {
    stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasBankkonto: YesNoAnswer,
    },
  },
  eigentumBankkontenUebersicht: {
    stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "bankkonten",
      schema: bankkontenArraySchema,
      fieldName: "hasBankkonto",
    },
  },
  eigentumBankkonto: {
    stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonto/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "bankkonten#kontoEigentuemer":
        bankkontenArraySchema.element.shape.kontoEigentuemer,
      "bankkonten#bankName": bankkontenArraySchema.element.shape.bankName,
      "bankkonten#kontostand": bankkontenArraySchema.element.shape.kontostand,
      "bankkonten#iban": bankkontenArraySchema.element.shape.iban,
      "bankkonten#kontoDescription":
        bankkontenArraySchema.element.shape.kontoDescription,
    },
  },
  eigentumBankkontoWarnung: {
    stepId: "/finanzielle-angaben/eigentum/bankkonten/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGeldanlagen: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGeldanlagenFrage: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasGeldanlage: YesNoAnswer,
    },
  },
  eigentumGeldanlagenUebersicht: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "geldanlagen",
      schema: geldanlagenArraySchema,
      fieldName: "hasGeldanlage",
    },
  },
  eigentumGeldanlage: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGeldanlageArt: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/art",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#art": geldanlagenArtSchema,
    },
  },
  eigentumGeldanlageBargeld: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/bargeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageWertpapiere: {
    stepId:
      "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/wertpapiere",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageGuthabenkontoKrypto: {
    stepId:
      "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/guthabenkonto-krypto",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageGiroTagesgeldSparkonto: {
    stepId:
      "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/giro-tagesgeld-sparkonto",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
      "geldanlagen#kontoBankName": sparkontoSchema.shape.kontoBankName,
      "geldanlagen#kontoIban": sparkontoSchema.shape.kontoIban,
      "geldanlagen#kontoBezeichnung": sparkontoSchema.shape.kontoBezeichnung,
    },
  },
  eigentumGeldanlageBefristet: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/befristet",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
      "geldanlagen#befristetArt": befristetSchema.shape.befristetArt,
      "geldanlagen#verwendungszweck": befristetSchema.shape.verwendungszweck,
      "geldanlagen#auszahlungdatum": befristetSchema.shape.auszahlungdatum,
    },
  },
  eigentumGeldanlageForderung: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/forderung",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#forderung": forderungSchema.shape.forderung,
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageSonstiges: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/sonstiges",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#verwendungszweck": sonstigesSchema.shape.verwendungszweck,
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlagenWarnung: {
    stepId: "/finanzielle-angaben/eigentum/geldanlagen/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumKraftfahrzeuge: {
    stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumKraftfahrzeugeFrage: {
    stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasKraftfahrzeug: YesNoAnswer,
    },
  },
  eigentumKraftfahrzeugeUebersicht: {
    stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "kraftfahrzeuge",
      schema: kraftfahrzeugeArraySchema,
      fieldName: "hasKraftfahrzeug",
    },
  },
  eigentumKraftfahrzeug: {
    stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      kraftfahrzeuge: kraftfahrzeugeArraySchema,
    },
  },
  eigentumKraftfahrzeugArbeitsweg: {
    stepId:
      "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug-arbeitsweg",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kraftfahrzeuge#hasArbeitsweg": sharedKraftfahrzeugeFields.hasArbeitsweg,
    },
  },
  eigentumKraftfahrzeugWert: {
    stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug-wert",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kraftfahrzeuge#wert": kraftfahrzeugWertSchema,
    },
  },
  eigentumKraftfahrzeugFahrzeuge: {
    stepId:
      "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug-fahrzeuge",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kraftfahrzeuge#art": kraftfahrzeugOver10000OrUnsureSchema.shape.art,
      "kraftfahrzeuge#marke": kraftfahrzeugOver10000OrUnsureSchema.shape.marke,
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
  eigentumKraftfahrzeugeWarnung: {
    stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumWertgegenstaende: {
    stepId: "/finanzielle-angaben/eigentum/wertgegenstaende",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumWertgegenstaendeFrage: {
    stepId:
      "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasWertsache: YesNoAnswer,
    },
  },
  eigentumWertgegenstaendeUebersicht: {
    stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "wertsachen",
      schema: wertsachenArraySchema,
      fieldName: "hasWertsache",
    },
  },
  eigentumWertgegenstand: {
    stepId:
      "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "wertsachen#art": wertsacheSchema.shape.art,
      "wertsachen#eigentuemer": wertsacheSchema.shape.eigentuemer,
      "wertsachen#wert": wertsacheSchema.shape.wert,
    },
  },
  eigentumWertgegenstaendeWarnung: {
    stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGrundeigentum: {
    stepId: "/finanzielle-angaben/eigentum/grundeigentum",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGrundeigentumFrage: {
    stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  eigentumGrundeigentumUebersicht: {
    stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGrundeigentumGrundeigentum: {
    stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      grundeigentum: grundeigentumArraySchema,
    },
    arrayPages: {
      "bewohnt-frage": {
        pageSchema: {
          "grundeigentum#isBewohnt": grundeigentumIsBewohntSchema,
        },
      },
      daten: {
        pageSchema: {
          "grundeigentum#art": sharedGrundeigentumFields.art,
          "grundeigentum#eigentuemer": sharedGrundeigentumFields.eigentuemer,
          "grundeigentum#flaeche": sharedGrundeigentumFields.flaeche,
          "grundeigentum#verkaufswert": sharedGrundeigentumFields.verkaufswert,
          "grundeigentum#strassehausnummer": stringRequiredSchema,
          "grundeigentum#plz": stringOptionalSchema,
          "grundeigentum#ort": stringRequiredSchema,
          "grundeigentum#land": stringRequiredSchema,
        },
      },
      "bewohnt-daten": {
        pageSchema: {
          "grundeigentum#art": sharedGrundeigentumFields.art,
          "grundeigentum#eigentuemer": sharedGrundeigentumFields.eigentuemer,
          "grundeigentum#flaeche": sharedGrundeigentumFields.flaeche,
          "grundeigentum#verkaufswert": sharedGrundeigentumFields.verkaufswert,
        },
      },
    },
  },
  eigentumGrundeigentumWarnung: {
    stepId: "/finanzielle-angaben/eigentum/grundeigentum/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;

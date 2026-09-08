import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { eigentuemerInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { ibanSchema } from "~/services/validation/iban";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createYearSchema } from "~/services/validation/year";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

export const bankkontenArraySchema = z
  .array(
    z.object({
      bankName: stringRequiredSchema,
      kontostand: buildMoneyValidationSchema({}),
      iban: schemaOrEmptyString(ibanSchema),
      kontoEigentuemer: eigentuemerInputSchema,
      kontoDescription: stringOptionalSchema,
    }),
  )
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

export const kraftfahrzeugeArraySchema = z
  .union([kraftfahrzeugUnder10000Schema, kraftfahrzeugOver10000OrUnsureSchema])
  .array()
  .min(1);

export const wertsacheSchema = z.object({
  art: stringRequiredSchema,
  eigentuemer: z.enum([
    "myself",
    "partner",
    "myselfAndPartner",
    "myselfAndSomeoneElse",
  ]),
  wert: buildMoneyValidationSchema(),
});

export const wertsachenArraySchema = z.array(wertsacheSchema).min(1);

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

export const grundeigentumArraySchema = z
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
  .min(1);

export const berhAntragFinanzielleAngabenEigentumPages = {
  eigentumInfo: {
    stepId: "finanzielle-angaben/eigentum/eigentum-info",
  },
  eigentumHeiratInfo: {
    stepId: "finanzielle-angaben/eigentum/heirat-info",
  },
  eigentumBankkontenFrage: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
    pageSchema: {
      hasBankkonto: YesNoAnswer,
    },
  },
  eigentumBankkontenUebersicht: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "bankkonten",
      schema: bankkontenArraySchema,
      fieldName: "hasBankkonto",
    },
  },
  eigentumBankkonto: {
    stepId: "finanzielle-angaben/eigentum/bankkonten/bankkonto/#/daten",
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
    stepId: "finanzielle-angaben/eigentum/bankkonten/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGeldanlagenFrage: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
    pageSchema: {
      hasGeldanlage: YesNoAnswer,
    },
  },
  eigentumGeldanlagenUebersicht: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "geldanlagen",
      schema: geldanlagenArraySchema,
      fieldName: "hasGeldanlage",
    },
  },
  eigentumGeldanlageArt: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/art",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#art": geldanlagenArtSchema,
    },
  },
  eigentumGeldanlageBargeld: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/bargeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageWertpapiere: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/wertpapiere",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageGuthabenkontoKrypto: {
    stepId:
      "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/guthabenkonto-krypto",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageGiroTagesgeldSparkonto: {
    stepId:
      "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/giro-tagesgeld-sparkonto",
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
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/befristet",
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
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/forderung",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#forderung": forderungSchema.shape.forderung,
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlageSonstiges: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/geldanlage/#/sonstiges",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "geldanlagen#verwendungszweck": sonstigesSchema.shape.verwendungszweck,
      "geldanlagen#eigentuemer": sharedGeldanlagenFields.eigentuemer,
      "geldanlagen#wert": sharedGeldanlagenFields.wert,
    },
  },
  eigentumGeldanlagenWarnung: {
    stepId: "finanzielle-angaben/eigentum/geldanlagen/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumKraftfahrzeugeFrage: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
    pageSchema: {
      hasKraftfahrzeug: YesNoAnswer,
    },
  },
  eigentumKraftfahrzeugeUebersicht: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "kraftfahrzeuge",
      schema: kraftfahrzeugeArraySchema,
      fieldName: "hasKraftfahrzeug",
    },
  },
  eigentumKraftfahrzeugArbeitsweg: {
    stepId:
      "finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug/#/arbeitsweg",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kraftfahrzeuge#hasArbeitsweg": sharedKraftfahrzeugFields.hasArbeitsweg,
    },
  },
  eigentumKraftfahrzeugWert: {
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug/#/wert",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kraftfahrzeuge#wert": sharedKraftfahrzeugFields.wert,
    },
  },
  eigentumKraftfahrzeugFahrzeuge: {
    stepId:
      "finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug/#/fahrzeuge",
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
    stepId: "finanzielle-angaben/eigentum/kraftfahrzeuge/warnung",
    shouldCollapseIntoParentNavItem: true,
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
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "wertsachen",
      schema: wertsachenArraySchema,
      fieldName: "hasWertsache",
    },
  },
  eigentumWertgegenstand: {
    stepId:
      "finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "wertsachen#art": wertsacheSchema.shape.art,
      "wertsachen#eigentuemer": wertsacheSchema.shape.eigentuemer,
      "wertsachen#wert": wertsacheSchema.shape.wert,
    },
  },
  eigentumWertgegenstaendeWarnung: {
    stepId: "finanzielle-angaben/eigentum/wertgegenstaende/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  eigentumGrundeigentumFrage: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
    pageSchema: { hasGrundeigentum: YesNoAnswer },
  },
  eigentumGrundeigentumUebersicht: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "grundeigentum",
      schema: grundeigentumArraySchema,
      fieldName: "hasGrundeigentum",
    },
  },
  eigentumGrundeigentumBewohntFrage: {
    stepId:
      "finanzielle-angaben/eigentum/grundeigentum/grundeigentum/#/bewohnt-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "grundeigentum#isBewohnt": sharedEigentumFields.isBewohnt,
    },
  },
  eigentumGrundeigentumDaten: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/grundeigentum/#/daten",
    shouldCollapseIntoParentNavItem: true,
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
  eigentumGrundeigentumBewohntDaten: {
    stepId:
      "finanzielle-angaben/eigentum/grundeigentum/grundeigentum/#/bewohnt-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "grundeigentum#art": sharedEigentumFields.art,
      "grundeigentum#eigentuemer": sharedEigentumFields.eigentuemer,
      "grundeigentum#flaeche": sharedEigentumFields.flaeche,
      "grundeigentum#verkaufswert": sharedEigentumFields.verkaufswert,
    },
  },
  eigentumGrundeigentumWarnung: {
    stepId: "finanzielle-angaben/eigentum/grundeigentum/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;

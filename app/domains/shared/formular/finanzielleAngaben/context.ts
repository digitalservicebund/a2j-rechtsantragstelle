import { z } from "zod";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createYearSchema } from "~/services/validation/year";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const Eigentuemer = z.enum(
  ["myself", "partner", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

export type Eigentumer = z.infer<typeof Eigentuemer>;

const MINUS_150_YEARS = -150;

const GrundeigentumArt = z.enum(
  [
    "eigentumswohnung",
    "einfamilienhaus",
    "mehrereWohnungen",
    "unbebaut",
    "erbbaurecht",
    "garage",
  ],
  customRequiredErrorMessage,
);

export const familyRelationshipSchema = z.enum(
  [
    "mother",
    "father",
    "grandmother",
    "grandfather",
    "kid",
    "ex-spouse-f",
    "ex-spouse-m",
    "grandchild",
  ],
  customRequiredErrorMessage,
);

export const unterhaltszahlungSchema = z.object({
  firstName: stringRequiredSchema,
  surname: stringRequiredSchema,
  familyRelationship: familyRelationshipSchema,
  birthday: createDateSchema({
    earliest: () => addYears(today(), MINUS_150_YEARS),
    latest: () => today(),
  }),
  monthlyPayment: buildMoneyValidationSchema(),
});

export const staatlicheLeistungen = z.enum(
  ["grundsicherung", "asylbewerberleistungen", "buergergeld", "keine"],
  customRequiredErrorMessage,
);

export type BankkontenArraySchema = z.infer<typeof bankkontenArraySchema>;

export const bankkontenArraySchema = z.array(
  z.object({
    bankName: stringRequiredSchema,
    kontostand: buildMoneyValidationSchema({}),
    iban: stringOptionalSchema,
    kontoEigentuemer: Eigentuemer,
    kontoDescription: stringOptionalSchema,
  }),
);

export const financialEntrySchema = z.object({
  beschreibung: stringRequiredSchema,
  betrag: buildMoneyValidationSchema(),
  zahlungsfrequenz: z.enum(
    ["monthly", "quarterly", "yearly", "one-time"],
    customRequiredErrorMessage,
  ),
});

export type FinancialEntry = z.infer<typeof financialEntrySchema>;

export const kraftfahrzeugWert = z.enum(
  ["under10000", "over10000", "unsure"],
  customRequiredErrorMessage,
);

export const livingSituationSchema = z.enum(
  ["alone", "withRelatives", "withOthers"],
  customRequiredErrorMessage,
);

export type KraftfahrzeugeArraySchema = z.infer<
  typeof kraftfahrzeugeArraySchema
>;

export const kraftfahrzeugeArraySchema = z.array(
  z
    .object({
      art: stringRequiredSchema,
      marke: stringRequiredSchema,
      eigentuemer: Eigentuemer,
      verkaufswert: optionalOrSchema(buildMoneyValidationSchema()),
      kilometerstand: integerSchema,
      anschaffungsjahr: createYearSchema({
        optional: true,
        latest: () => today().getFullYear(),
      }),
      baujahr: createYearSchema({ latest: () => today().getFullYear() }),
      hasArbeitsweg: YesNoAnswer,
      wert: kraftfahrzeugWert,
    })
    .partial(),
);

export type GeldanlagenArraySchema = z.infer<typeof geldanlagenArraySchema>;

export const geldanlagenArraySchema = z.array(
  z
    .object({
      art: z.enum(
        [
          "bargeld",
          "wertpapiere",
          "guthabenkontoKrypto",
          "giroTagesgeldSparkonto",
          "befristet",
          "forderung",
          "sonstiges",
        ],
        customRequiredErrorMessage,
      ),
      eigentuemer: Eigentuemer,
      wert: buildMoneyValidationSchema(),

      kontoBankName: stringOptionalSchema,
      kontoIban: stringOptionalSchema,
      kontoBezeichnung: stringOptionalSchema,

      befristetArt: z
        .enum(
          ["lifeInsurance", "buildingSavingsContract", "fixedDepositAccount"],
          customRequiredErrorMessage,
        )
        .optional(),

      forderung: stringOptionalSchema,
      verwendungszweck: stringOptionalSchema,
      auszahlungdatum: stringOptionalSchema,
    })
    .partial(),
);

export type GrundeigentumArraySchema = z.infer<typeof grundeigentumArraySchema>;

export const grundeigentumArraySchema = z.array(
  z
    .object({
      isBewohnt: z.enum(["yes", "family", "no"], customRequiredErrorMessage),
      art: GrundeigentumArt,
      eigentuemer: Eigentuemer,
      flaeche: stringRequiredSchema,
      verkaufswert: buildMoneyValidationSchema(),
      strassehausnummer: stringRequiredSchema,
      plz: stringOptionalSchema,
      ort: stringRequiredSchema,
      land: stringRequiredSchema,
    })
    .partial(),
);

export type WertsachenArraySchema = z.infer<typeof wertsachenArraySchema>;

export const wertsachenArraySchema = z.array(
  z.object({
    art: stringRequiredSchema,
    eigentuemer: Eigentuemer,
    wert: buildMoneyValidationSchema(),
  }),
);

export const partnerschaftSchema = z.enum(
  ["yes", "no", "separated", "widowed"],
  customRequiredErrorMessage,
);

export const kinderArraySchema = z.array(
  z
    .object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      geburtsdatum: createDateSchema({
        earliest: () => addYears(today(), -24),
        latest: () => today(),
      }),
      wohnortBeiAntragsteller: z.enum(
        ["yes", "no", "partially"],
        customRequiredErrorMessage,
      ),
      eigeneEinnahmen: YesNoAnswer,
      einnahmen: buildMoneyValidationSchema(),
      unterhalt: YesNoAnswer,
      unterhaltsSumme: buildMoneyValidationSchema(),
    })
    .partial(),
);

export type KinderArraySchema = z.infer<typeof kinderArraySchema>;

export const besondereBelastungenSchema = z.object({
  pregnancy: checkedOptional,
  singleParent: checkedOptional,
  disability: checkedOptional,
  medicalReasons: checkedOptional,
});

import { z } from "zod";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createYearSchema } from "~/services/validation/year";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

export const eigentuemerInputSchema = z.enum([
  "myself",
  "partner",
  "myselfAndPartner",
  "myselfAndSomeoneElse",
]);

export type Eigentumer = z.infer<typeof eigentuemerInputSchema>;

const MINUS_150_YEARS = -150;

const grundeigentumArtInputSchema = z.enum([
  "eigentumswohnung",
  "einfamilienhaus",
  "mehrereWohnungen",
  "unbebaut",
  "erbbaurecht",
  "garage",
]);

export const familyRelationshipInputSchema = z.enum([
  "mother",
  "father",
  "grandmother",
  "grandfather",
  "kid",
  "ex-spouse",
  "ex-partner",
  "grandchild",
]);

export const unterhaltszahlungInputSchema = z.object({
  firstName: stringRequiredSchema,
  surname: stringRequiredSchema,
  familyRelationship: familyRelationshipInputSchema,
  birthday: createDateSchema({
    earliest: () => addYears(today(), MINUS_150_YEARS),
    latest: () => today(),
  }),
  monthlyPayment: buildMoneyValidationSchema(),
});

export const staatlicheLeistungenInputSchema = z.enum([
  "grundsicherung",
  "asylbewerberleistungen",
  "buergergeld",
  "keine",
]);

export type BankkontenArraySchema = z.infer<typeof bankkontenArraySchema>;

export const bankkontenArraySchema = z.array(
  z.object({
    bankName: stringRequiredSchema,
    kontostand: buildMoneyValidationSchema({}),
    iban: stringOptionalSchema,
    kontoEigentuemer: eigentuemerInputSchema,
    kontoDescription: stringOptionalSchema,
  }),
);

export const financialEntryInputSchema = z.object({
  beschreibung: stringRequiredSchema,
  betrag: buildMoneyValidationSchema(),
  zahlungsfrequenz: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
});

export type FinancialEntry = z.infer<typeof financialEntryInputSchema>;

export const kraftfahrzeugWertInputSchema = z.enum([
  "under10000",
  "over10000",
  "unsure",
]);

export type KraftfahrzeugeArraySchema = z.infer<
  typeof kraftfahrzeugeArraySchema
>;

export const kraftfahrzeugeArraySchema = z.array(
  z
    .object({
      art: stringRequiredSchema,
      marke: stringRequiredSchema,
      eigentuemer: eigentuemerInputSchema,
      verkaufswert: schemaOrEmptyString(buildMoneyValidationSchema()),
      kilometerstand: integerSchema,
      anschaffungsjahr: createYearSchema({
        optional: true,
        latest: () => today().getFullYear(),
      }),
      baujahr: createYearSchema({ latest: () => today().getFullYear() }),
      hasArbeitsweg: YesNoAnswer,
      wert: kraftfahrzeugWertInputSchema,
    })
    .partial(),
);

export type GeldanlagenArraySchema = z.infer<typeof geldanlagenArraySchema>;

export const geldanlagenArraySchema = z.array(
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
      eigentuemer: eigentuemerInputSchema,
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
);

export type GrundeigentumArraySchema = z.infer<typeof grundeigentumArraySchema>;

export const grundeigentumArraySchema = z.array(
  z
    .object({
      isBewohnt: z.enum(["yes", "family", "no"]),
      art: grundeigentumArtInputSchema,
      eigentuemer: eigentuemerInputSchema,
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
    eigentuemer: eigentuemerInputSchema,
    wert: buildMoneyValidationSchema(),
  }),
);

export const partnerschaftInputSchema = z.enum([
  "yes",
  "no",
  "separated",
  "widowed",
]);

export const childBirthdaySchema = createDateSchema({
  earliest: () => addYears(today(), -24),
  latest: () => today(),
});

const sharedChildFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsdatum: childBirthdaySchema,
};

const childSchema = z
  .object({
    ...sharedChildFields,
    wohnortBeiAntragsteller: z.literal("no"),
    unterhalt: z.literal("no"),
  })
  .or(
    z.object({
      ...sharedChildFields,
      wohnortBeiAntragsteller: z.literal("no"),
      unterhalt: z.literal("yes"),
      unterhaltsSumme: buildMoneyValidationSchema(),
    }),
  )
  .or(
    z.object({
      ...sharedChildFields,
      wohnortBeiAntragsteller: z.enum(["yes", "partially"]),
      eigeneEinnahmen: z.literal("yes"),
      einnahmen: buildMoneyValidationSchema(),
    }),
  )
  .or(
    z.object({
      ...sharedChildFields,
      wohnortBeiAntragsteller: z.enum(["yes", "partially"]),
      eigeneEinnahmen: z.literal("no"),
    }),
  );

export const childrenArraySchema = z.array(childSchema).min(1);

export type KinderSchema = z.infer<typeof childSchema>; // Todo: rename to ChildSchema

export const besondereBelastungen = [
  "pregnancy",
  "singleParent",
  "disability",
  "medicalReasons",
  "none",
] as const;

export const besondereBelastungenInputSchema =
  exclusiveCheckboxesSchema(besondereBelastungen);

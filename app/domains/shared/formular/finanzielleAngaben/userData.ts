import { z } from "zod";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const eigentuemerInputSchema = z.enum([
  "myself",
  "partner",
  "myselfAndPartner",
  "myselfAndSomeoneElse",
]);

export type Eigentumer = z.infer<typeof eigentuemerInputSchema>;

export const staatlicheLeistungenInputSchema = z.enum([
  "grundsicherung",
  "asylbewerberleistungen",
  "buergergeld",
  "keine",
]);

export type BankkontenArraySchema = z.infer<typeof bankkontenArraySchema>;

export const bankkontenArraySchema = z
  .array(
    z.object({
      bankName: stringRequiredSchema,
      kontostand: buildMoneyValidationSchema({}),
      iban: stringOptionalSchema,
      kontoEigentuemer: eigentuemerInputSchema,
      kontoDescription: stringOptionalSchema,
    }),
  )
  .min(1);

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

export const besondereBelastungen = [
  "pregnancy",
  "singleParent",
  "disability",
  "medicalReasons",
  "none",
] as const;

export const besondereBelastungenInputSchema =
  exclusiveCheckboxesSchema(besondereBelastungen);

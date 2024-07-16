import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { eigentuemer } from "./eigentuemer";

const wert = buildMoneyValidationSchema();
const art = z.enum(
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
);

const bargeld = z.object({
  art: z.literal(art.Enum.bargeld),
  eigentuemer,
  wert,
});
const wertpapiere = z.object({
  art: z.literal(art.Enum.wertpapiere),
  eigentuemer,
  wert,
});
const guthabenKonto = z.object({
  art: z.literal(art.Enum.guthabenkontoKrypto),
  eigentuemer,
  wert,
});
const giroTagesKonto = z.object({
  art: z.literal(art.Enum.giroTagesgeldSparkonto),
  eigentuemer,
  wert,
  kontoBankName: stringOptionalSchema,
  kontoIban: stringOptionalSchema,
  kontoBezeichnung: stringOptionalSchema,
});
const befristet = z.object({
  art: z.literal(art.Enum.befristet),
  eigentuemer,
  wert,
  befristetArt: z.enum(
    ["lifeInsurance", "buildingSavingsContract", "fixedDepositAccount"],
    customRequiredErrorMessage,
  ),
  verwendungszweck: stringOptionalSchema,
  auszahlungdatum: stringOptionalSchema,
});
const forderung = z.object({
  art: z.literal(art.Enum.forderung),
  eigentuemer,
  wert,
  forderung: stringOptionalSchema,
});
const sonstiges = z.object({
  art: z.literal(art.Enum.sonstiges),
  eigentuemer,
  wert,
  verwendungszweck: stringOptionalSchema,
});

export const geldanlageSchema = z.discriminatedUnion("art", [
  bargeld,
  wertpapiere,
  guthabenKonto,
  giroTagesKonto,
  befristet,
  forderung,
  sonstiges,
]);

// To pick a validation for an arbitrary subpage, we  need a single object
// The discriminated union needs to be added, since all emember unions

export const geldanlage = bargeld
  .merge(wertpapiere)
  .merge(guthabenKonto)
  .merge(giroTagesKonto)
  .merge(befristet)
  .merge(forderung)
  .merge(sonstiges)
  .partial()
  .merge(z.object({ art, eigentuemer, wert }));

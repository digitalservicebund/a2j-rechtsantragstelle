import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import { type AllContexts } from "../../common";

const gerichtskostenvorschuss = {
  below_500: 114,
  above_500: 174,
  above_1000: 234,
  above_1500: 294,
  above_2000: 357,
  above_3000: 420,
  above_4000: 483,
} as const;

export const getGerichtskostenvorschuss = (context: AllContexts) => {
  if (
    !("geldspanne" in context) ||
    !context.geldspanne ||
    context.geldspanne === "no" ||
    context.geldspanne === "above_5000"
  )
    return 0;
  return gerichtskostenvorschuss[context.geldspanne];
};

export const gerichtskostenFromBetrag = (betrag: number) => {
  if (betrag < 500) return gerichtskostenvorschuss.below_500;
  if (betrag < 1000) return gerichtskostenvorschuss.above_500;
  if (betrag < 1500) return gerichtskostenvorschuss.above_1000;
  if (betrag < 2000) return gerichtskostenvorschuss.above_1500;
  if (betrag < 3000) return gerichtskostenvorschuss.above_2000;
  if (betrag < 4000) return gerichtskostenvorschuss.above_3000;
  return gerichtskostenvorschuss.above_4000;
};

export const gesamtKosten = (context: AllContexts) => {
  return "forderung" in context && typeof context.forderung === "object"
    ? parseCurrencyStringDE(context.forderung?.forderung2?.betrag) +
        parseCurrencyStringDE(context.forderung?.forderung1?.betrag)
    : 0;
};

import invariant from "tiny-invariant";

/**
 * Returns a formatted EUR string (without currency sign)
 * @example
 * // returns "1,23"
 * formatCents(123);
 */
const formatCents = (cents: number) => {
  invariant(Number.isSafeInteger(cents), "please pass only (safe) integers");
  const formatter = new Intl.NumberFormat("de-de", {
    minimumFractionDigits: 2,
  });
  return formatter.format(cents / 100);
};

export default formatCents;

export const parseCurrencyStringDE = (formattedCents?: string) =>
  Number.parseFloat((formattedCents ?? "").replace(".", "").replace(",", "."));

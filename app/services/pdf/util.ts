export const nettoString = "netto";

export function removeDecimalsFromCurrencyString(
  currencyString: string | undefined,
) {
  if (currencyString === undefined) return;
  return currencyString.replace(/,\d{2}/g, "");
}

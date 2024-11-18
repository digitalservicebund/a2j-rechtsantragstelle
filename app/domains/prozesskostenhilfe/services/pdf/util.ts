import type { FinancialEntry } from "~/domains/shared/formular/finanzielleAngaben/context";

export const nettoString = "netto";

export const getTotalMonthlyFinancialEntries = (
  financialEntries: FinancialEntry[],
) =>
  financialEntries
    .map((entry) => {
      const betragNumber = Number(
        entry.betrag.replaceAll(".", "").replace(",", "."),
      );
      switch (entry.zahlungsfrequenz) {
        case "monthly":
          return betragNumber;
        case "quarterly":
          return betragNumber / 3;
        case "one-time":
          return betragNumber / 12;
        case "yearly":
          return betragNumber / 12;
      }
    })
    .reduce((a, b) => a + b, 0)
    .toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

export function removeDecimalsFromCurrencyString(
  currencyString: string | undefined,
) {
  if (currencyString === undefined) return;
  return currencyString.replace(/,\d{2}/g, "");
}

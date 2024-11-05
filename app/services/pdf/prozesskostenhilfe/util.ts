import type { FinancialEntry } from "~/domains/shared/finanzielleAngaben/context";

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

import type { FinancialEntry } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";

export const getTotalMonthlyFinancialEntries = (
  financialEntries: FinancialEntry[],
) => {
  return financialEntries.reduce((acc, { betrag: currentAmount }) => {
    return acc + parseInt(currentAmount);
  }, 0);
};

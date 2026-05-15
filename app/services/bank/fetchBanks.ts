import { type BankData } from "./bankNameFromIBAN";

export async function fetchBanks(): Promise<BankData | undefined> {
  try {
    const response = await fetch("/api/banks/list");
    if (response.ok) {
      return await response.json();
    }
  } catch {
    return undefined;
  }
}

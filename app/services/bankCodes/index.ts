import bankData from "../../../data/bankCodes.json";

export type BankData = Map<number, string>;

let bankDataMap: BankData = new Map<number, string>();

function loadBankData() {
  if (bankDataMap.size === 0) {
    (
      bankData as Array<{ Bankleitzahl: number; Kurzbezeichnung: string }>
    ).forEach((entry) => {
      bankDataMap.set(entry["Bankleitzahl"], entry["Kurzbezeichnung"]);
    });
  }
  return bankDataMap;
}

export function bankNameFromIBAN(iban?: string) {
  if (!iban) return undefined;
  const bankCode = Number(iban.replaceAll(" ", "").substring(4, 12));
  return loadBankData().get(bankCode);
}

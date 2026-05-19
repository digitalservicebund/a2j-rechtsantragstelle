export type BankData = Record<number, string>;

export function bankNameFromIBAN(iban: string, banks: BankData) {
  const bankCode = Number(iban.replaceAll(" ", "").substring(4, 12));
  return banks[bankCode];
}

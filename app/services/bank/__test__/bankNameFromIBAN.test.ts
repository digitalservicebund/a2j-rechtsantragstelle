import { bankNameFromIBAN } from "../bankNameFromIBAN";

const invalidIBAN = "DE00000000000000000000";
const validIBAN = "DE02120300000000202051";
const mockBankName = "Deutsche Kreditbank Suhl";

describe("bankNameFromIBAN", () => {
  it("should return undefined if no match is found", () => {
    const bankName = bankNameFromIBAN(invalidIBAN, {
      [12345]: "Deutsche Bank",
    });
    expect(bankName).toBeUndefined();
  });

  it("should return the matching bank name when a valid IBAN is given", () => {
    const bankName = bankNameFromIBAN(validIBAN, {
      [Number(validIBAN.substring(4, 12))]: mockBankName,
    });
    expect(bankName).toBe(mockBankName);
  });
});

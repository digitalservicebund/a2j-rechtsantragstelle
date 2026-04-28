import { bankNameFromIBAN } from "~/services/bankCodes";

const invalidIBAN = "DE00000000000000000000";

/**
 * Deutsche Kreditbank Suhl
 */
const validIBAN = "DE02120300000000202051";

describe("bankNameFromIBAN", () => {
  it("should return undefined if an iban is not given", () => {
    const bankName = bankNameFromIBAN();
    expect(bankName).toBeUndefined();
  });

  it("should return undefined if no match is found", () => {
    const bankName = bankNameFromIBAN(invalidIBAN);
    expect(bankName).toBeUndefined();
  });

  it("should return the matching bank name when a valid IBAN is given", () => {
    const bankName = bankNameFromIBAN(validIBAN);
    expect(bankName).toBe("Deutsche Kreditbank Suhl");
  });
});

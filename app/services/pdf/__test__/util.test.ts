import { removeDecimalsFromCurrencyString } from "../util";

describe("removeDecimalsFromCurrencyString", () => {
  it("should remove decimals from a currency string", () => {
    const result = removeDecimalsFromCurrencyString("1.234,56");
    expect(result).toBe("1.234");
  });

  it("should return the same string if there are no decimals", () => {
    const result = removeDecimalsFromCurrencyString("1.234");
    expect(result).toBe("1.234");
  });

  it("should handle an empty string", () => {
    const result = removeDecimalsFromCurrencyString("");
    expect(result).toBe("");
  });

  it("should handle strings without currency values", () => {
    const result = removeDecimalsFromCurrencyString("Hello World");
    expect(result).toBe("Hello World");
  });
});

import type { SafeParseError } from "zod";
import { ibanSchema } from "../iban";

describe("iban validation", () => {
  describe("success cases", () => {
    const cases = [
      {
        input: "DE14100205001234567890",
        expected: "DE14100205001234567890",
      },
      {
        input: " DE14 1002 0500 1234 5678 90 ",
        expected: "DE14100205001234567890",
      },
      { input: "de14100205001234567890", expected: "DE14100205001234567890" },
      {
        input: "KW81 CBKU000000000000 1234560101",
        expected: "KW81CBKU0000000000001234560101",
      },
      {
        input: " NO8330001234567 ",
        expected: "NO8330001234567",
      },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = ibanSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "invalid_iban_format" },
      { input: "foobar", errorMessage: "invalid_iban_format" },
      { input: "DE1410020500123456789", errorMessage: "invalid_iban_format" },
      { input: "DE14100205001234567891", errorMessage: "invalid_iban_format" },
      { input: "DE141002050012345678901", errorMessage: "invalid_iban_format" },
      { input: "NO8330001234568", errorMessage: "invalid_iban_format" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = ibanSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});

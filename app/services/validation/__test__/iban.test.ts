import type { SafeParseError } from "zod";
import { ibanSchema } from "../iban";

describe("iban validation", () => {
  describe("success cases", () => {
    const cases = [
      {
        input: " DE 91 1000 0000 0123456789",
        expected: "DE91100000000123456789",
      },
      {
        input: " DE 91 1000 0000 0123456789 ",
        expected: "DE91100000000123456789",
      },
      { input: "DE91100000000123456789 ", expected: "DE91100000000123456789" },
      { input: " DE91100000000123456789 ", expected: "DE91100000000123456789" },
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
      { input: "DE", errorMessage: "invalid_iban_format" },
      { input: "123DE", errorMessage: "invalid_iban_format" },
      { input: " :) ", errorMessage: "invalid_iban_format" },
      { input: "foobar ", errorMessage: "invalid_iban_format" },
      { input: "DE9110000000012345678", errorMessage: "invalid_iban_format" },
      { input: "DE911000000001234567891", errorMessage: "invalid_iban_format" },
      { input: "randomtext", errorMessage: "invalid_iban_format" },
      { input: "DE92100000000123456789", errorMessage: "invalid_iban_format" },
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

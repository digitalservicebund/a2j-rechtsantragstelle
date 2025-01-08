import type { SafeParseError } from "zod";
import { airportSchema } from "~/services/validation/airport";

describe("airport validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: " BER ", expected: "BER" },
      { input: "Bar", expected: "BAR" },
      { input: " bEr ", expected: "BER" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = airportSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "wrong_airport_format" },
      { input: "ab", errorMessage: "wrong_airport_format" },
      { input: "123", errorMessage: "wrong_airport_format" },
      { input: " :) ", errorMessage: "wrong_airport_format" },
      { input: "foobar ", errorMessage: "wrong_airport_format" },
      { input: "XXX", errorMessage: "invalid_airport_code" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = airportSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});

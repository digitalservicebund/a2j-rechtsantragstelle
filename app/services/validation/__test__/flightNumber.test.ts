import type { SafeParseError } from "zod";
import { flightNumberSchema } from "../flightNumber";

describe("airport validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: " LH 20 ", expected: "LH20" },
      { input: "Lh20", expected: "LH20" },
      { input: " Lh20 ", expected: "LH20" },
      { input: " lh20 ", expected: "LH20" },
      { input: " LH20 ", expected: "LH20" },
      { input: "lH 20 ", expected: "LH20" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = flightNumberSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "invalid_flight_number_format" },
      { input: "LH", errorMessage: "invalid_flight_number_format" },
      { input: "123LH", errorMessage: "invalid_flight_number_format" },
      { input: " :) ", errorMessage: "invalid_flight_number_format" },
      { input: "foobar ", errorMessage: "invalid_flight_number_format" },
      { input: "XXX", errorMessage: "invalid_flight_number_format" },
      { input: "XXX12345", errorMessage: "invalid_flight_number_format" },
      { input: "randomtext", errorMessage: "invalid_flight_number_format" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = flightNumberSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});

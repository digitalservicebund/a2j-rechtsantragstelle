import type { SafeParseError } from "zod";
import { bookingNumberFlightSchema } from "../bookingNumberFlight";

describe("bookingNumberFlight validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: " X3 6Q 9C", expected: "X36Q9C" },
      { input: "x36Q9C", expected: "X36Q9C" },
      { input: " X36q9C ", expected: "X36Q9C" },
      { input: " x36q9c ", expected: "X36Q9C" },
      { input: " X36Q9C ", expected: "X36Q9C" },
      { input: "x3 6Q9C ", expected: "X36Q9C" },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = bookingNumberFlightSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "invalid_booking_number_flight_format" },
      { input: "x36Q", errorMessage: "invalid_booking_number_flight_format" },
      { input: "ABCD", errorMessage: "invalid_booking_number_flight_format" },
      { input: " :) ", errorMessage: "invalid_booking_number_flight_format" },
      { input: "1234 ", errorMessage: "invalid_booking_number_flight_format" },
      { input: "XXX", errorMessage: "invalid_booking_number_flight_format" },
      {
        input: "XXX12345",
        errorMessage: "invalid_booking_number_flight_format",
      },
      {
        input: "randomtext",
        errorMessage: "invalid_booking_number_flight_format",
      },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = bookingNumberFlightSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });
});

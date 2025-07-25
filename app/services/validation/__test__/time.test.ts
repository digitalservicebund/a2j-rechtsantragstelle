import { timeSchema } from "~/services/validation/time";

describe("time validation", () => {
  describe("success cases", () => {
    const cases = [{ input: "  15:00  ", expected: "15:00" }];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = timeSchema.safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "    ", errorMessage: "required" },
      { input: "1234567890", errorMessage: "format" },
      { input: "90:00", errorMessage: "invalid" },
      { input: "2400", errorMessage: "format" },
      { input: "24:00hihi", errorMessage: "format" },
      { input: "twentyfour:zerozero", errorMessage: "format" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = timeSchema.safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});

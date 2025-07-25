import { createDateSchema } from "~/services/validation/date";

describe("date validation", () => {
  describe("success cases", () => {
    const cases = [{ input: " 01.03.2023  ", expected: "01.03.2023" }];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = createDateSchema().safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: "", errorMessage: "required" },
      { input: "    ", errorMessage: "required" },
      { input: "1234567890", errorMessage: "format" },
      { input: "10.10.2010.20", errorMessage: "format" },
      { input: "2010-12-01", errorMessage: "format" },
      { input: "01.01.2023hihi", errorMessage: "format" },
      { input: "01.01.2023456", errorMessage: "format" },
      { input: "1.1.2023", errorMessage: "format" },
      { input: "01.01.23", errorMessage: "format" },
      { input: "40.10.2010", errorMessage: "invalid" },
      { input: "10.20.2010", errorMessage: "invalid" },
      {
        input: "01.01.2020",
        errorMessage: "too_early",
        earliest: () => new Date("2020-01-02"),
      },
      {
        input: "02.01.2020",
        errorMessage: "too_late",
        latest: () => new Date("2020-01-01"),
      },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage, earliest, latest }) => {
        const actual = createDateSchema({ earliest, latest }).safeParse(input);
        expect(actual.success).toBe(false);
        expect(actual.error!.issues[0].message).toBe(errorMessage);
      },
    );
  });
});

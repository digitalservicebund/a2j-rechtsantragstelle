import { convertToTimestamp, createDateSchema, toDate } from "../dateString";

describe("createDateSchema", () => {
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

describe("dateString conversions", () => {
  describe("toDate", () => {
    it("parses correctly", () => {
      expect(toDate("01.01.2000")).toEqual(new Date("2000-01-01"));
    });
  });

  describe("convertToTimestamp", () => {
    it("should convert a valid date and time to a timestamp", () => {
      const date = "24.03.2025";
      const time = "15:30";
      const expectedTimestamp = new Date(2025, 2, 24, 15, 30).getTime();

      const actual = convertToTimestamp(date, time);

      expect(actual).toBe(expectedTimestamp);
    });
  });
});

import {
  createDateSchema,
  createSplitDateSchema,
} from "~/services/validation/date";

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

describe("date split input validation", () => {
  describe("success cases", () => {
    const cases = [
      {
        input: {
          day: 1,
          month: 3,
          year: 2023,
        },
        expected: {
          day: 1,
          month: 3,
          year: 2023,
        },
      },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = createSplitDateSchema().safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      {
        input: {
          day: "",
          month: "",
          year: "",
        },
        errorPath: "day",
        errorMessage: "required",
      },
      {
        input: {
          day: 32,
          month: 1,
          year: 2020,
        },
        errorPath: "day",
        errorMessage: "day_out_of_range",
      },
      {
        input: {
          day: 10,
          month: 13,
          year: 2020,
        },
        errorPath: "month",
        errorMessage: "month_out_of_range",
      },
      {
        input: {
          day: 10,
          month: 12,
          year: 1800,
        },
        errorPath: "year",
        errorMessage: "year_out_of_range",
      },
      {
        input: {
          day: 31,
          month: 2,
          year: 2020,
        },
        errorPath: "month",
        errorMessage: "invalid_date_format",
      },
      {
        input: {
          day: "aa",
          month: 1,
          year: 2020,
        },
        errorPath: "day",
        errorMessage: "invalid_day_format",
      },
      {
        input: {
          day: 10,
          month: "bb",
          year: 2020,
        },
        errorPath: "month",
        errorMessage: "invalid_month_format",
      },
      {
        input: {
          day: 10,
          month: 12,
          year: "cccc",
        },
        errorPath: "year",
        errorMessage: "required",
      },
      {
        input: {
          day: -1,
          month: 12,
          year: 2000,
        },
        errorPath: "day",
        errorMessage: "invalid_day_format",
      },
      {
        input: {
          day: 10,
          month: -12,
          year: 2000,
        },
        errorPath: "month",
        errorMessage: "invalid_month_format",
      },
      {
        input: {
          day: 10,
          month: 12,
          year: -2000,
        },
        errorPath: "year",
        errorMessage: "invalid_year_format",
      },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage on $errorPath",
      ({ input, errorPath, errorMessage }) => {
        const actual = createSplitDateSchema().safeParse(input);
        expect(actual.success).toBe(false);

        const issue = actual.error?.issues.find((i) =>
          i.path.includes(errorPath),
        );
        expect(issue?.message).toBe(errorMessage);
      },
    );
  });
});

import {
  createDateSchema,
  createDateSplitSchema,
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
          tag: "01",
          monat: "03",
          jahr: "2023",
        },
        expected: {
          tag: "01",
          monat: "03",
          jahr: "2023",
        },
      },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = createDateSplitSchema().safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      {
        input: {
          tag: "",
          monat: "",
          jahr: "",
        },
        errorPath: "tag",
        errorMessage: "required",
      },
      {
        input: {
          tag: "32",
          monat: "01",
          jahr: "2020",
        },
        errorPath: "tag",
        errorMessage: "day_out_of_range",
      },
      {
        input: {
          tag: "10",
          monat: "13",
          jahr: "2020",
        },
        errorPath: "monat",
        errorMessage: "month_out_of_range",
      },
      {
        input: {
          tag: "10",
          monat: "12",
          jahr: "1800",
        },
        errorPath: "jahr",
        errorMessage: "year_out_of_range",
      },
      {
        input: {
          tag: "31",
          monat: "02",
          jahr: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: "invalid",
      },
      {
        input: {
          tag: "01",
          monat: "01",
          jahr: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: "too_early",
        earliest: () => new Date("2020-01-02"),
      },
      {
        input: {
          tag: "02",
          monat: "01",
          jahr: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: "too_late",
        latest: () => new Date("2020-01-01"),
      },
      {
        input: {
          tag: "aa",
          monat: "01",
          jahr: "2020",
        },
        errorPath: "tag",
        errorMessage: "invalid_day_format",
      },
      {
        input: {
          tag: "10",
          monat: "bb",
          jahr: "2020",
        },
        errorPath: "monat",
        errorMessage: "invalid_month_format",
      },
      {
        input: {
          tag: "10",
          monat: "12",
          jahr: "cccc",
        },
        errorPath: "jahr",
        errorMessage: "invalid_year_format",
      },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage on $errorPath",
      ({ input, errorPath, errorMessage, earliest, latest }) => {
        const actual = createDateSplitSchema({ earliest, latest }).safeParse(
          input,
        );
        expect(actual.success).toBe(false);

        const issue = actual.error?.issues.find((i) =>
          i.path.includes(errorPath),
        );
        expect(issue?.message).toBe(errorMessage);
      },
    );
  });
});

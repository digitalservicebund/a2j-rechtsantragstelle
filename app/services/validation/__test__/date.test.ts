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
          geburtsdatumTag: "01",
          geburtsdatumMonat: "03",
          geburtsdatumJahr: "2023",
        },
        expected: {
          geburtsdatumTag: "01",
          geburtsdatumMonat: "03",
          geburtsdatumJahr: "2023",
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
          geburtsdatumTag: "",
          geburtsdatumMonat: "",
          geburtsdatumJahr: "",
        },
        errorPath: "geburtsdatumTag",
        errorMessage: "required",
      },
      {
        input: {
          geburtsdatumTag: "32",
          geburtsdatumMonat: "01",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatumTag",
        errorMessage: "day_out_of_range",
      },
      {
        input: {
          geburtsdatumTag: "10",
          geburtsdatumMonat: "13",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatumMonat",
        errorMessage: "month_out_of_range",
      },
      {
        input: {
          geburtsdatumTag: "10",
          geburtsdatumMonat: "12",
          geburtsdatumJahr: "1800",
        },
        errorPath: "geburtsdatumJahr",
        errorMessage: "year_out_of_range",
      },
      {
        input: {
          geburtsdatumTag: "31",
          geburtsdatumMonat: "02",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: "invalid",
      },
      {
        input: {
          geburtsdatumTag: "01",
          geburtsdatumMonat: "01",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: "too_early",
        earliest: () => new Date("2020-01-02"),
      },
      {
        input: {
          geburtsdatumTag: "02",
          geburtsdatumMonat: "01",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: "too_late",
        latest: () => new Date("2020-01-01"),
      },
      {
        input: {
          geburtsdatumTag: "aa",
          geburtsdatumMonat: "01",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatumTag",
        errorMessage: "invalid_day_format",
      },
      {
        input: {
          geburtsdatumTag: "10",
          geburtsdatumMonat: "bb",
          geburtsdatumJahr: "2020",
        },
        errorPath: "geburtsdatumMonat",
        errorMessage: "invalid_month_format",
      },
      {
        input: {
          geburtsdatumTag: "10",
          geburtsdatumMonat: "12",
          geburtsdatumJahr: "cccc",
        },
        errorPath: "geburtsdatumJahr",
        errorMessage: "invalid_year_format",
      },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage on $errorPath",
      ({ input, errorPath, errorMessage, earliest, latest }) => {
        const actual = createSplitDateSchema({ earliest, latest }).safeParse(
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

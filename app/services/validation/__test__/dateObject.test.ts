import { createSplitDateSchema, toDate } from "../dateObject";

describe("createSplitDateSchema", () => {
  describe("success cases", () => {
    const cases = [
      {
        input: {
          day: "1",
          month: "3",
          year: "2023",
        },
        expected: {
          day: "01",
          month: "03",
          year: "2023",
        },
      },
      {
        input: {
          day: "01",
          month: "03",
          year: "2023",
        },
        expected: {
          day: "01",
          month: "03",
          year: "2023",
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
        errorMessage: "Diese Felder müssen ausgefüllt werden.",
      },
      {
        input: {
          day: "32",
          month: "1",
          year: "2020",
        },
        errorPath: "day",
        errorMessage: "Ungültiger Tag",
      },
      {
        input: {
          day: "10",
          month: "13",
          year: "2020",
        },
        errorPath: "month",
        errorMessage: "Ungültiger Monat",
      },
      {
        input: {
          day: "aa",
          month: "1",
          year: "2020",
        },
        errorPath: "day",
        errorMessage: "Ungültiger Tag",
      },
      {
        input: {
          day: "10",
          month: "bb",
          year: "2020",
        },
        errorPath: "month",
        errorMessage: "Ungültiger Monat",
      },
      {
        input: {
          day: "10",
          month: "12",
          year: "cccc",
        },
        errorPath: "year",
        errorMessage: "Ungültiges Jahr",
      },
      {
        input: {
          day: "-1",
          month: "12",
          year: "2000",
        },
        errorPath: "day",
        errorMessage: "Ungültiger Tag",
      },
      {
        input: {
          day: "10",
          month: "-12",
          year: "2000",
        },
        errorPath: "month",
        errorMessage: "Ungültiger Monat",
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

  test("too early", () => {
    const actual = createSplitDateSchema({
      earliest: () =>
        toDate({
          day: "02",
          month: "01",
          year: "2025",
        }),
    }).safeParse({
      day: "01",
      month: "01",
      year: "2025",
    });
    expect(actual.success).toEqual(false);
  });

  test("too early", () => {
    const actual = createSplitDateSchema({
      latest: () =>
        toDate({
          day: "01",
          month: "01",
          year: "2025",
        }),
    }).safeParse({
      day: "02",
      month: "01",
      year: "2025",
    });
    expect(actual.success).toEqual(false);
  });
});

import { createSplitDateSchema } from "../dateObject";

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
          day: "1",
          month: "3",
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
    const invalid_birthdate = "Bitte geben Sie ein gültiges Geburtsdatum ein.";
    const input_required = "Diese Felder müssen ausgefüllt werden.";

    const cases = [
      {
        input: {
          day: "",
          month: "",
          year: "",
        },
        errorPath: "day",
        errorMessage: input_required,
      },
      {
        input: {
          day: "32",
          month: "1",
          year: "2020",
        },
        errorPath: "day",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "10",
          month: "13",
          year: "2020",
        },
        errorPath: "month",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "10",
          month: "10",
          year: "2500",
        },
        errorPath: "year",
        errorMessage: "Geburtsdatum muss in der Vergangenheit liegen.",
      },
      {
        input: {
          day: "10",
          month: "12",
          year: "1800",
        },
        errorPath: "year",
        errorMessage: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
      },
      {
        input: {
          day: "31",
          month: "2",
          year: "2020",
        },
        errorPath: "geburtsdatum",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "aa",
          month: "1",
          year: "2020",
        },
        errorPath: "day",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "10",
          month: "bb",
          year: "2020",
        },
        errorPath: "month",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "10",
          month: "12",
          year: "cccc",
        },
        errorPath: "year",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "-1",
          month: "12",
          year: "2000",
        },
        errorPath: "day",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "10",
          month: "-12",
          year: "2000",
        },
        errorPath: "month",
        errorMessage: invalid_birthdate,
      },
      {
        input: {
          day: "10",
          month: "12",
          year: "-2000",
        },
        errorPath: "year",
        errorMessage: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
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

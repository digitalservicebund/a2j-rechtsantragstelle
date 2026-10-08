import { createSplitTimeSchema } from "../timeObject";

describe("timeObject", () => {
  describe("check sucessfull results", () => {
    const cases = [
      {
        input: {
          hour: "10",
          minute: "30",
        },
        expected: {
          hour: "10",
          minute: "30",
        },
      },
      {
        input: {
          hour: "23",
          minute: "59",
        },
        expected: {
          hour: "23",
          minute: "59",
        },
      },
      {
        input: {
          hour: "00",
          minute: "00",
        },
        expected: {
          hour: "00",
          minute: "00",
        },
      },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = createSplitTimeSchema().safeParse(input);
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("check fail results", () => {
    const cases = [
      {
        input: {
          hour: "",
          minute: "",
        },
        errorPath: "hour",
        errorMessage: "required",
      },
      {
        input: {
          hour: "00",
          minute: "",
        },
        errorPath: "minute",
        errorMessage: "required",
      },
      {
        input: {
          hour: "aa",
          minute: "59",
        },
        errorPath: "hour",
        errorMessage: "Ungültiger Stunde",
      },
      {
        input: {
          hour: "233",
          minute: "59",
        },
        errorPath: "hour",
        errorMessage: "Ungültiger Stunde",
      },
      {
        input: {
          hour: "23",
          minute: "599",
        },
        errorPath: "minute",
        errorMessage: "Ungültiger Minute",
      },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage on $errorPath",
      ({ input, errorPath, errorMessage }) => {
        const actual = createSplitTimeSchema().safeParse(input);
        expect(actual.success).toBe(false);

        const issue = actual.error?.issues.find((i) =>
          i.path.includes(errorPath),
        );
        expect(issue?.message).toBe(errorMessage);
      },
    );

    it("should fail when the time is not valid", () => {
      const actual = createSplitTimeSchema().safeParse({
        hour: "24",
        minute: "59",
      });
      expect(actual.success).toBe(false);
      expect(actual.error?.issues[0].message).toBe("Ungültige Uhrzeit");
    });
  });
});

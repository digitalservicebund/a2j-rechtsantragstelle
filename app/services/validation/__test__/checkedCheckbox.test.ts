import {
  exclusiveCheckboxesSchema,
  checkedOptional,
} from "~/services/validation/checkedCheckbox";

const exclusiveCheckboxes = ["a", "b", "c", "none"];

describe("checkedCheckbox validation", () => {
  describe("exclusiveCheckboxes", () => {
    it("Should spread in checkbox names into a zod object", () => {
      const schema = exclusiveCheckboxesSchema(exclusiveCheckboxes);
      expect(schema.shape).toEqual({
        a: checkedOptional,
        b: checkedOptional,
        c: checkedOptional,
        none: checkedOptional,
      });
      expect(schema.meta()?.description).toBe("exclusive_checkbox");
    });

    describe("success cases", () => {
      const cases = [
        {
          input: { a: "off", b: "off", c: "off", none: "on" },
          expected: { a: "off", b: "off", c: "off", none: "on" },
        },
        {
          input: { a: "on", b: "off", c: "off", none: "off" },
          expected: { a: "on", b: "off", c: "off", none: "off" },
        },
      ];

      test.each(cases)(
        "given $input, returns $expected",
        ({ input, expected }) => {
          const actual =
            exclusiveCheckboxesSchema(exclusiveCheckboxes).safeParse(input);
          expect(actual).toEqual({ data: expected, success: true });
        },
      );
    });

    describe("failing cases", () => {
      const cases = [
        {
          input: { a: "off", b: "off", c: "off", none: "off" },
          errorMessage: "Bitte treffen Sie eine Auswahl",
        },
        {
          input: { a: "on", b: "off", c: "on", none: "on" },
          errorMessage: "Ungültige Kombination",
        },
      ];

      test.each(cases)(
        "given $input, returns $errorMessage",
        ({ input, errorMessage }) => {
          const actual =
            exclusiveCheckboxesSchema(exclusiveCheckboxes).safeParse(input);
          expect(actual.success).toBe(false);
          expect(actual.error!.issues[0].message).toBe(errorMessage);
        },
      );
    });
  });
});

import { SafeParseError } from "zod";
import { listRenderer } from "~/services/cms/models/StrapiList";
import { tileRenderer } from "~/services/cms/models/StrapiTile";
import { buildRichTextValidation } from "~/services/validation/richtext";

describe("richtext validation", () => {
  describe("success cases", () => {
    const cases = [
      { input: "Some text", expected: "<p>Some text</p>" },
      { input: "- List item", expected: "<ul><li>List item</li></ul>" },
      {
        input: "Some text\n\n- List item\n- List item 2",
        expected:
          "<p>Some text</p><ul><li>List item</li><li>List item 2</li></ul>",
      },
    ];

    test.each(cases)(
      "given $input, returns $expected",
      ({ input, expected }) => {
        const actual = buildRichTextValidation().safeParse(input);
        // Marked adds newline characters automatically after parsing -- we need to strip these for best results
        actual.data = actual.data?.replaceAll(/\n/g, "");
        expect(actual).toEqual({ data: expected, success: true });
      },
    );
  });

  describe("failing cases", () => {
    const cases = [
      { input: true, errorMessage: "Expected string, received boolean" },
      { input: 1234, errorMessage: "Expected string, received number" },
      { input: {}, errorMessage: "Expected string, received object" },
    ];

    test.each(cases)(
      "given $input, returns $errorMessage",
      ({ input, errorMessage }) => {
        const actual = buildRichTextValidation().safeParse(input);
        expect(actual.success).toBe(false);
        expect(
          (actual as SafeParseError<unknown>).error.issues[0].message,
        ).toBe(errorMessage);
      },
    );
  });

  describe("custom renderers", () => {
    test("uses custom tile renderer", () => {
      const paragraphText = "Some paragraph";
      expect(
        buildRichTextValidation(tileRenderer).safeParse(paragraphText),
      ).toEqual({
        data: `<p class="ds-subhead">${paragraphText}</p>`,
        success: true,
      });
    });

    test("uses custom list renderer", () => {
      const paragraphText = "Some paragraph";
      expect(
        buildRichTextValidation(listRenderer).safeParse(paragraphText),
      ).toEqual({
        data: `<p class="ds-subhead max-w-full">${paragraphText}</p>`,
        success: true,
      });
    });

    test("uses an arbitrary renderer", () => {
      const headingText = "Some heading";
      expect(
        buildRichTextValidation({
          heading: ({ text }) => `<h2>${text}</h2>`,
        }).safeParse(`# ${headingText}`),
      ).toEqual({
        data: `<h2>${headingText}</h2>`,
        success: true,
      });
    });
  });
});

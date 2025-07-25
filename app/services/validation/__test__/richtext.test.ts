import { listRenderer } from "~/services/cms/models/StrapiList";
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
    const cases = [true, 1234, {}];

    test.each(cases)("raises invalid_type for $0", (input) => {
      const actual = buildRichTextValidation().safeParse(input);
      expect(actual.success).toBe(false);
      expect(actual.error!.issues[0].code).toBe("invalid_type");
    });
  });

  describe("custom renderers", () => {
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

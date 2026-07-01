import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";

describe("parseAndSanitizeMarkdown", () => {
  describe("Conditional list handling", () => {
    it("should leave the html unmodified if there are no lists within conditional tags", () => {
      const html = "<p>test</p>";
      expect(parseAndSanitizeMarkdown(html)).toBe(html);
    });

    it("should reorder an opening list tag if needed", () => {
      const htmlNestedList =
        "{{ #conditional }}<ul><li>item 1</li>{{ /conditional }}</ul>";
      const expectedHtml =
        "<ul>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ul>";
      expect(parseAndSanitizeMarkdown(htmlNestedList)).toBe(expectedHtml);
      const invertedConditionHtml =
        "{{^conditional}}<ul><li>item 1</li>{{/conditional}}</ul>";
      const expectedInvertedConditionHtml =
        "<ul>{{^conditional}}<li>item 1</li>{{/conditional}}</ul>";
      expect(parseAndSanitizeMarkdown(invertedConditionHtml)).toBe(
        expectedInvertedConditionHtml,
      );
    });

    it("should handle multiple lists", () => {
      const htmlNestedUnorderedList =
        "{{ #conditional }}<ul><li>item 1</li>{{ /conditional }}</ul>{{ #conditional2 }}<ul><li>item 2</li>{{ /conditional2 }}</ul>";
      const expectedHtmlUnorderedList =
        "<ul>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ul><ul>{{ #conditional2 }}<li>item 2</li>{{ /conditional2 }}</ul>";
      expect(parseAndSanitizeMarkdown(htmlNestedUnorderedList)).toBe(
        expectedHtmlUnorderedList,
      );
      const htmlNestedOrderedList =
        "{{ #conditional }}<ol><li>item 1</li>{{ /conditional }}</ol>{{ #conditional2 }}<ol><li>item 2</li>{{ /conditional2 }}</ol>";
      const expectedHtmlOrderedList =
        "<ol>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ol><ol>{{ #conditional2 }}<li>item 2</li>{{ /conditional2 }}</ol>";
      expect(parseAndSanitizeMarkdown(htmlNestedOrderedList)).toBe(
        expectedHtmlOrderedList,
      );
    });

    it("shouldn't modify html with correctly formatted lists (not inside conditionals)", () => {
      const htmlWithCorrectList =
        "<ul>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ul>";
      expect(parseAndSanitizeMarkdown(htmlWithCorrectList)).toBe(
        htmlWithCorrectList,
      );
    });

    it("should leave the html unmodified if a list has contextual content preceding it, inside of a conditional", () => {
      const htmlString = `{{ #variable }}Please upload the following:<ul><li>Thing 1</li><li>Thing 2</li></ul>{{ /variable }}`;
      expect(parseAndSanitizeMarkdown(htmlString)).toBe(
        "<p>{{ #variable }}Please upload the following:</p><ul><li>Thing 1</li><li>Thing 2</li></ul>{{ /variable }}",
      );
    });
  });

  describe("Empty tag removal", () => {
    it("should remove empty paragraphs and keep contentful elements", () => {
      const htmlString = "<ul><p></p><li>Thing 1</li><p>Keep me</p></ul>";

      expect(parseAndSanitizeMarkdown(htmlString)).toBe(
        "<ul><li>Thing 1</li><p>Keep me</p></ul>",
      );
    });

    it("should keep void elements like br or svg paths without throwing", () => {
      const htmlString = "<p>Line 1<br>Line 2</p><svg><path /></svg><p></p>";

      expect(parseAndSanitizeMarkdown(htmlString)).toBe(
        "<p>Line 1<br/>Line 2</p><svg><path></path></svg>",
      );
    });
  });
});

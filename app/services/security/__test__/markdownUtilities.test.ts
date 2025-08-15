import {
  contentExistsBeforeList,
  handleNestedLists,
} from "~/services/security/markdownUtilities";

describe("markdownUtilities", () => {
  describe("handleNestedLists", () => {
    it("should leave the html unmodified if there are no lists within conditional tags", () => {
      const html = "<p>test</p>";
      expect(handleNestedLists(html)).toBe(html);
    });

    it("should reorder an opening list tag if needed", () => {
      const htmlNestedList =
        "{{ #conditional }}<ul><li>item 1</li>{{ /conditional }}</ul>";
      const expectedHtml =
        "<ul>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ul>";
      expect(handleNestedLists(htmlNestedList)).toBe(expectedHtml);
      const invertedConditionHtml =
        "{{^conditional}}<ul><li>item 1</li>{{/conditional}}</ul>";
      const expectedInvertedConditionHtml =
        "<ul>{{^conditional}}<li>item 1</li>{{/conditional}}</ul>";
      expect(handleNestedLists(invertedConditionHtml)).toBe(
        expectedInvertedConditionHtml,
      );
    });

    it("should handle multiple lists", () => {
      const htmlNestedUnorderedList =
        "{{ #conditional }}<ul><li>item 1</li>{{ /conditional }}</ul>{{ #conditional2 }}<ul><li>item 2</li>{{ /conditional2 }}</ul>";
      const expectedHtmlUnorderedList =
        "<ul>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ul><ul>{{ #conditional2 }}<li>item 2</li>{{ /conditional2 }}</ul>";
      expect(handleNestedLists(htmlNestedUnorderedList)).toBe(
        expectedHtmlUnorderedList,
      );
      const htmlNestedOrderedList =
        "{{ #conditional }}<ol><li>item 1</li>{{ /conditional }}</ol>{{ #conditional2 }}<ol><li>item 2</li>{{ /conditional2 }}</ol>";
      const expectedHtmlOrderedList =
        "<ol>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ol><ol>{{ #conditional2 }}<li>item 2</li>{{ /conditional2 }}</ol>";
      expect(handleNestedLists(htmlNestedOrderedList)).toBe(
        expectedHtmlOrderedList,
      );
    });

    it("shouldn't modify html with correctly formatted lists (not inside conditionals)", () => {
      const htmlWithCorrectList =
        "<ul>{{ #conditional }}<li>item 1</li>{{ /conditional }}</ul>";
      expect(handleNestedLists(htmlWithCorrectList)).toBe(htmlWithCorrectList);
    });

    it("should leave the html unmodified if a list has contextual content preceding it, inside of a conditional", () => {
      const htmlString = `
        {{ #variable }}
        Please upload the following:
        <ul>
        <li>Thing 1</li>
        <li>Thing 2</li>
        </ul>
        {{ /variable }}
      `;
      expect(handleNestedLists(htmlString)).toBe(htmlString);
    });
  });

  describe("contentExistsBeforeList", () => {
    it("should return true if content appears before the list", () => {
      const htmlString = `
        {{ #variable }}
        Please upload the following:
        <ul>
        <li>Thing 1</li>
        <li>Thing 2</li>
        </ul>
        {{ /variable }}
      `;
      expect(contentExistsBeforeList(htmlString)).toBe(true);
    });

    it("should return false if the conditional is purely list content", () => {
      const htmlString = `
        Please upload the following:
        {{ #variable }}
        <ul>
        <li>Thing 1</li>
        <li>Thing 2</li>
        </ul>
        {{ /variable }}
      `;
      expect(contentExistsBeforeList(htmlString)).toBe(false);
    });
  });
});

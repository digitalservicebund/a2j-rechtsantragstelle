import {
  contentExistsBeforeList,
  handleNestedLists,
  sanitize,
} from "~/services/security/markdownUtilities";

describe("markdownUtilities", () => {
  describe("sanitizeHtml", () => {
    describe("leaves valid tags & classes", () => {
      const validStrings = {
        paragraph: '<p class="ds-subhead max-w-full">paragraph</p>',
        textStyling: "<div><i>a</i><b>b</b><strong>c</strong></div>",
        link: '<a rel="noopener noreferrer" aria-label="label" class="text-link min-h-[24px] inline-block">link</a>',
        h1: '<h1 class="ds-heading-01-reg ds-label-01-bold ds-heading-02-reg"></h1>',
        h2: '<h2 class="ds-heading-01-reg ds-label-01-bold ds-heading-02-reg"></h2>',
        h3: '<h3 class="ds-heading-01-reg ds-label-01-bold ds-heading-02-reg"></h3>',
        h4: '<h4 class="ds-heading-01-reg ds-label-01-bold ds-heading-02-reg"></h4>',
        h5: '<h5 class="ds-heading-01-reg ds-label-01-bold ds-heading-02-reg"></h5>',
        h6: '<h6 class="ds-heading-01-reg ds-label-01-bold ds-heading-02-reg"></h6>',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewbox="0 0 24 24" width="1.2em" role="graphics-symbol img" focusable="false" aria-hidden="true" style="display:inline-block;"><path d="M0 0h24v24H0z" fill="none"></path></svg>',
        doubleCurlyBracesLink: '<a href="{{interpolatedExternalUrl}}"></a>',
        tripleCurlyBracesLink: '<a href="{{{interpolatedExternalUrl}}}"></a>',
      };

      test.each(Object.entries(validStrings))("%s", (_, html) => {
        expect(sanitize(html)).toBe(html);
      });
    });

    describe("removes invalid tags", () => {
      const invalidStrings = [
        ["onclick tag", '<p onclick="() => alert("test")"></p>', "<p></p>"],
        ["iframe", '<iframe src="https://www.test.com"></iframe>', ""],
        ["script tag", '<script>alert("hello")</script>', ""],
        [
          "script href",
          '<a href="{{javascript:alert(1)}}">Click me</a>',
          "<a href>Click me</a>",
        ],
        [
          "script tag within Mustache",
          '<a href="{{<script>alert(1)</script>}}">Click me</a>',
          "<a href>Click me</a>",
        ],
        [
          "invalid URL within Mustache",
          '<a href="{{http://invalida<>.com}}">Click me</a>',
          "<a href>Click me</a>",
        ],
        [
          "javascript event handler within Mustache",
          '<a href="{{javascript:alert(1)}}">Click me</a>',
          "<a href>Click me</a>",
        ],
        [
          "escaping sequence to bypass regex",
          '<a href="{{{javascript:alert(1)}}}">Click me</a>',
          "<a href>Click me</a>",
        ],
      ];

      test.each(invalidStrings)("%s", (_, html, expected) => {
        expect(sanitize(html)).toBe(expected);
      });
    });
  });

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

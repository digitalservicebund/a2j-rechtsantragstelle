import { stringWithHtmlEntities } from "../stringWithHtmlEntities";

test("stringWithHtmlEntities should decode html entities", () => {
  const stringWithEntities = "&lt;h1&gt;random test&shy;word&#x27;s";
  const actual = stringWithHtmlEntities.safeParse(stringWithEntities);
  expect(actual).toEqual({ data: "<h1>random test­word's", success: true });
});

import { stringWithHtmlEntities } from "../stringWithHtmlEntities";

test("stringWithHtmlEntities should decode html entities", () => {
  const stringWithEntities = "&lt;h1&gt;test&lt;/h1&gt;";
  const actual = stringWithHtmlEntities.safeParse(stringWithEntities);
  expect(actual).toEqual({ data: "<h1>test</h1>", success: true });
});

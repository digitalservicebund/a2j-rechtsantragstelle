import { getSortedFields } from "../getSortedFields";

describe("getSortedFields", () => {
  test("returns pageFields as is when sortedFields is undefined", () => {
    const pageFields = ["title", "date", "author"];

    const actual = getSortedFields(pageFields);

    expect(actual).toEqual(pageFields);
  });

  test("returns pageFields as is when sortedFields is an empty string", () => {
    const pageFields = ["title", "date", "author"];

    const actual = getSortedFields(pageFields);

    expect(actual).toEqual(pageFields);
  });

  test("sorts pageFields according to sortedFields", () => {
    const pageFields = ["title", "date", "author", "content"];
    const sortedFields = "author\ndate";

    const actual = getSortedFields(pageFields, sortedFields);

    expect(actual).toEqual(["author", "date", "title", "content"]);
  });

  test("keeps unspecified fields in their original order after sorted ones", () => {
    const pageFields = ["title", "date", "author", "content", "summary"];
    const sortedFields = "summary\ntitle";

    const actual = getSortedFields(pageFields, sortedFields);

    expect(actual).toEqual(["summary", "title", "date", "author", "content"]);
  });

  test("handles sortedFields containing items not in pageFields", () => {
    const pageFields = ["title", "date", "author"];
    const sortedFields = "author\ndate\nnonexistent";

    const actual = getSortedFields(pageFields, sortedFields);

    expect(actual).toEqual(["author", "date", "title"]);
  });
});

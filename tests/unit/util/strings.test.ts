import {
  normalizeURL,
  splitObjectsByFirstLetter,
  stripLeadingZeros,
  stripTrailingSlashFromURL,
} from "~/util/strings";

describe("stripLeadingZeros", () => {
  it("strips leading zeros", () => {
    expect(stripLeadingZeros("0010")).toBe("10");
  });

  it("can handle undefined input", () => {
    expect(stripLeadingZeros(undefined)).toBe("");
  });
});

describe("groupByFirstLetter", () => {
  it("groups by first letter", () => {
    expect(
      splitObjectsByFirstLetter([{ t: "a" }, { t: "b" }], "t")
    ).toStrictEqual({
      a: [{ t: "a" }],
      b: [{ t: "b" }],
    });
  });

  it("handles empty input", () => {
    expect(splitObjectsByFirstLetter([], "a")).toStrictEqual({});
  });
});

describe("normalizeUrl", () => {
  it("leaves https urls alone", () => {
    const url = "https://test.url";
    expect(normalizeURL(url)).toEqual(url);
  });

  it("prepends https to urls if missing", () => {
    const url = "test.url";
    expect(normalizeURL(url)).toEqual(`https://${url}`);
  });
});

describe("stripTrailingSlashFromURL", () => {
  it("returnes undefined for correct URLs", () => {
    expect(stripTrailingSlashFromURL("https://test.url")).toEqual(undefined);
  });

  it("returns URL without slash if needed", () => {
    const url = "https://www.test.url/test/";
    expect(stripTrailingSlashFromURL(url)).toEqual("/test");
  });

  it("throws if input isn't valid URL", () => {
    expect(() => stripTrailingSlashFromURL("www.test.url/test/")).toThrow();
  });
});

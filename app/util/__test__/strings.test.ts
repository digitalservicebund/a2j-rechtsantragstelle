/* eslint-disable sonarjs/no-clear-text-protocols */
import {
  normalizeURL,
  splitObjectsByFirstLetter,
  stripLeadingZeros,
  stripTrailingSlashFromURL,
  uppercaseFirstLetter,
  lowercaseFirstLetter,
} from "~/util/strings";

describe("stripLeadingZeros", () => {
  it("strips leading zeros", () => {
    expect(stripLeadingZeros("0010")).toBe("10");
  });

  it("can handle undefined input", () => {
    expect(stripLeadingZeros()).toBe("");
  });
});

describe("uppercaseFirstLetter", () => {
  it("uppercases the first letter", () => {
    expect(uppercaseFirstLetter("asd")).toBe("Asd");
    expect(uppercaseFirstLetter("ASD")).toBe("ASD");
  });

  it("can handle undefined input", () => {
    expect(uppercaseFirstLetter()).toBe("");
  });
});

describe("lowercaseFirstLetter", () => {
  it("lowercases the first letter", () => {
    expect(lowercaseFirstLetter("ASD")).toBe("aSD");
    expect(lowercaseFirstLetter("asd")).toBe("asd");
  });

  it("can handle undefined input", () => {
    expect(lowercaseFirstLetter()).toBe("");
  });
});

describe("groupByFirstLetter", () => {
  it("groups by first letter", () => {
    expect(
      splitObjectsByFirstLetter([{ t: "a" }, { t: "b" }], "t"),
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
  const testURL = "https://test.url";

  it("by default leaves https alone", () => {
    expect(normalizeURL(testURL)).toEqual(testURL);
  });

  it("By default prepends https to urls if missing", () => {
    expect(normalizeURL("test.url")).toEqual(testURL);
  });

  it("can prepend http if wanted", () => {
    const url = "test.url";
    expect(normalizeURL(url, "http")).toEqual(`http://${url}`);
  });

  it("can enforce http if wanted", () => {
    expect(normalizeURL(testURL, "http")).toEqual("http://test.url");
  });

  it("leaves http if wanted", () => {
    const url = "http://test.url";
    expect(normalizeURL(url, "http")).toEqual(url);
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

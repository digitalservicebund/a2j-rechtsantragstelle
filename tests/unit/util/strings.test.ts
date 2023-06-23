import { splitObjectsByFirstLetter, stripLeadingZeros } from "~/util/strings";

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

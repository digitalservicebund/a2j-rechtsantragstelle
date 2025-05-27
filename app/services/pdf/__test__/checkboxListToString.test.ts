import { checkboxListToString } from "~/services/pdf/checkboxListToString";

describe("checkboxListToString()", () => {
  it("works for single entry", () => {
    expect(checkboxListToString({ a: "abc" }, { a: "on" })).toBe("abc");
  });

  it("works for multiple entries", () => {
    expect(
      checkboxListToString({ a: "abc", b: "jkl" }, { a: "on", b: "on" }),
    ).toBe("abc, jkl");
  });

  it("returns empty string without options", () => {
    expect(checkboxListToString({})).toBe("");
  });

  it("skips entries without mapping", () => {
    expect(checkboxListToString({ a: "abc", b: "jkl" }, { a: "on" })).toBe(
      "abc",
    );
  });
});

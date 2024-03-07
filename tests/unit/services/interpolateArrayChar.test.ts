import { interpolateArrayChar } from "~/util/arrayVariable";

describe("interpolateArrayChar()", () => {
  it("leaves strings without hash", () => {
    expect(interpolateArrayChar("a.b.c")).toBe("a.b.c");
  });

  it("interpolates hashes for the provided indicies", () => {
    expect(interpolateArrayChar("a.b#c", [1])).toBe("a.b[1]c");
    expect(interpolateArrayChar("a.b#c#d", [1, 0])).toBe("a.b[1]c[0]d");
  });

  it("throws an error if hashCount and indiciesCount don't match", () => {
    expect(() => interpolateArrayChar("a#b")).toThrow();
    expect(() => interpolateArrayChar("a.b", [0])).toThrow();
  });
});

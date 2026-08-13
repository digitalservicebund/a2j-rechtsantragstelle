import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";

describe("resolveArrayCharacter()", () => {
  it("interpolates hashes for the provided indicies", () => {
    expect(resolveArrayCharacter("a.b#c", [1])).toBe("a.b[1]c");
    expect(resolveArrayCharacter("a.b#c#d", [1, 0])).toBe("a.b[1]c[0]d");
  });

  it("interpolates hashes without brackets when withBrackets is false", () => {
    expect(resolveArrayCharacter("a/#/b", [1], false)).toBe("a/1/b");
    expect(resolveArrayCharacter("a/#/b/#/c", [1, 0], false)).toBe("a/1/b/0/c");
  });

  it("allows more indices than hashes, using only the first N", () => {
    expect(resolveArrayCharacter("a#b", [0, 1])).toBe("a[0]b");
  });

  it("throws an error if more hashes than indices exist", () => {
    expect(() => resolveArrayCharacter("a#b", [])).toThrow(expect.anything());
  });
  it("throws an error if there are more hashes than indices", () => {
    expect(() => resolveArrayCharacter("a#b#c", [0])).toThrow(
      expect.anything(),
    );
  });
});

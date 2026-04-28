import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";

describe("resolveArrayCharacter()", () => {
  it("interpolates hashes for the provided indicies", () => {
    expect(resolveArrayCharacter("a.b#c", [1])).toBe("a.b[1]c");
    expect(resolveArrayCharacter("a.b#c#d", [1, 0])).toBe("a.b[1]c[0]d");
  });

  it("throws an error if more hashes than indices exist", () => {
    expect(() => resolveArrayCharacter("a#b", [])).toThrow();
  });
});

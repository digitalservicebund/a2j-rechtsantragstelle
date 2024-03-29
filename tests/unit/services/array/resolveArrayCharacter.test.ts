import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";

describe("resolveArrayCharacter()", () => {
  it("interpolates hashes for the provided indicies", () => {
    expect(resolveArrayCharacter("a.b#c", [1])).toBe("a.b[1]c");
    expect(resolveArrayCharacter("a.b#c#d", [1, 0])).toBe("a.b[1]c[0]d");
  });

  it("throws an error if hashCount and indiciesCount don't match", () => {
    expect(() => resolveArrayCharacter("a.b", [0])).toThrow();
  });
});

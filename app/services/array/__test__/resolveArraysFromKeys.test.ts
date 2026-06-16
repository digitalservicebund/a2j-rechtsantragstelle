import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { resolveArrayCharacter } from "../resolveArrayCharacter";

describe("resolveArraysFromKeys()", () => {
  it("should work for flat data", () => {
    expect(resolveArraysFromKeys({ a: 1, b: 1 })).toStrictEqual({
      a: 1,
      b: 1,
    });
  });

  it("should work for nested data", () => {
    expect(resolveArraysFromKeys({ a: { b: 1 }, c: 1 })).toStrictEqual({
      a: { b: 1 },
      c: 1,
    });
  });

  it("should work for arrays", () => {
    expect(resolveArraysFromKeys({ "a#c": 1 }, [0])).toStrictEqual({
      a: [{ c: 1 }],
    });

    const expectedArray = Array(2);
    expectedArray[1] = { c: 1 }; // the first entry is never set
    expect(resolveArraysFromKeys({ "a#c": 1 }, [1])).toStrictEqual({
      a: expectedArray,
    });
  });
  it("throws an error if hashCount and indiciesCount don't match", () => {
    expect(() => resolveArrayCharacter("a.b", [0])).toThrow(expect.anything());
  });
});

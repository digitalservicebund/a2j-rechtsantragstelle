import { normalizeObject } from "~/util/normalizeObject";

describe("normalizeObject()", () => {
  it("should work for flat data", () => {
    expect(normalizeObject({ a: 1, b: 1 })).toStrictEqual({
      a: 1,
      b: 1,
    });
  });

  it("should work for nested data", () => {
    expect(normalizeObject({ a: { b: 1 }, c: 1 })).toStrictEqual({
      a: { b: 1 },
      c: 1,
    });
  });

  it("should work for arrays", () => {
    expect(normalizeObject({ "a#c": 1 }, [0])).toStrictEqual({
      a: [{ c: 1 }],
    });

    const expectedArray = Array(2);
    expectedArray[1] = { c: 1 }; // the first entry is never set
    expect(normalizeObject({ "a#c": 1 }, [1])).toStrictEqual({
      a: expectedArray,
    });
  });
});

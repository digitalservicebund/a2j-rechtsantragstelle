import { objectKeysNonEmpty } from "../objectKeysNonEmpty";

describe("objectKeysNonEmpty", () => {
  [undefined, null, "", [], {}].forEach((value) => {
    it(`should return false when the objectKeys parameter points to ${value}`, () => {
      const actual = objectKeysNonEmpty({ test: value }, ["test"]);
      expect(actual).toBe(false);
    });
  });

  it("should return true when the objectKeys parameter points to a non-empty value", () => {
    const actual = objectKeysNonEmpty({ test: "test" }, ["test"]);
    expect(actual).toBe(true);
  });

  it("should return true when all keys in objectKeys have non-empty values", () => {
    const objects = { a: "a", b: "b", c: "c" };
    const objectKeys = ["a", "b", "c"] as const;
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(true);
  });

  it("should return false when at least one key in objectKeys points to an empty value", () => {
    const objects = { a: "a", b: "b", c: undefined };
    const objectKeys = ["a", "b", "c"] as const;
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(false);
  });

  it("should return true when all keys in objectKeys point to non-empty values, even if other keys in the object have empty values", () => {
    const objects = { a: "a", b: "b", c: undefined };
    const objectKeys = ["a", "b"] as const;
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(true);
  });
});

import { objectKeysNonEmpty } from "../objectKeysNonEmpty";

describe("objectKeysNonEmpty", () => {
  it("should return false when the data parameter is null", () => {
    const actual = objectKeysNonEmpty(null, ["test"]);
    expect(actual).toBe(false);
  });

  it("should return false when the data parameter is undefined", () => {
    const actual = objectKeysNonEmpty(undefined, ["test"]);
    expect(actual).toBe(false);
  });

  it("should return false when the objectKeys parameter is an empty array", () => {
    const actual = objectKeysNonEmpty({ test: "test" }, []);
    expect(actual).toBe(false);
  });

  it("should return false when the objectKeys parameter points to an undefined value", () => {
    const actual = objectKeysNonEmpty({ test: undefined }, ["test"]);
    expect(actual).toBe(false);
  });

  it("should return false when the objectKeys parameter points to a null value", () => {
    const actual = objectKeysNonEmpty({ test: null }, ["test"]);
    expect(actual).toBe(false);
  });

  it("should return false when the objectKeys parameter points to an empty string", () => {
    const actual = objectKeysNonEmpty({ test: "" }, ["test"]);
    expect(actual).toBe(false);
  });

  it("should return true when the objectKeys parameter points to a non-empty value", () => {
    const actual = objectKeysNonEmpty({ test: "test" }, ["test"]);
    expect(actual).toBe(true);
  });

  it("should return true when all keys in objectKeys have non-empty values", () => {
    const objects = { a: "a", b: "b", c: "c" };
    const objectKeys = ["a", "b", "c"];
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(true);
  });

  it("should return false when at least one key in objectKeys points to an empty value", () => {
    const objects = { a: "a", b: "b", c: undefined };
    const objectKeys = ["a", "b", "c"];
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(false);
  });

  it("should return true when all keys in objectKeys point to non-empty values, even if other keys in the object have empty values", () => {
    const objects = { a: "a", b: "b", c: undefined };
    const objectKeys = ["a", "b"];
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(true);
  });

  it("should return false when is missing a key in the object from the objectKeys", () => {
    const objects = { a: "a", b: "b" };
    const objectKeys = ["a", "b", "c"];
    const actual = objectKeysNonEmpty(objects, objectKeys);
    expect(actual).toBe(false);
  });
});

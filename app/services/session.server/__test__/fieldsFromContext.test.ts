import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";

describe("fieldsFromContext()", () => {
  it("should work for flat data", () => {
    expect(fieldsFromContext({ a: 1, b: 1, c: 1 }, ["a", "b"])).toStrictEqual({
      a: 1,
      b: 1,
    });
  });

  it("should handle missing data", () => {
    expect(fieldsFromContext({}, ["a"])).toStrictEqual({});
  });

  it("should work for nested data", () => {
    expect(fieldsFromContext({ a: { b: 1 }, c: 1 }, ["a.b"])).toStrictEqual({
      a: {
        b: 1,
      },
    });
  });

  it("should work for arrays", () => {
    expect(
      fieldsFromContext({ a: [{ b: 1 }], pageData: { arrayIndexes: [0] } }, [
        "a#b",
      ]),
    ).toStrictEqual({
      "a#b": 1,
    });
  });

  it("throws an error for invalid lookup", () => {
    expect(() => fieldsFromContext({ a: [{ b: 1 }] }, ["a#b"])).toThrow();
  });
});

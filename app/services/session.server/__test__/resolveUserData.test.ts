import { resolveUserData } from "~/services/session.server/resolveUserData";

describe("resolveUserData()", () => {
  it("should work for flat data", () => {
    expect(resolveUserData({ a: 1, b: 1, c: 1 }, ["a", "b"])).toStrictEqual({
      a: 1,
      b: 1,
    });
  });

  it("should handle missing data", () => {
    expect(resolveUserData({}, ["a"])).toStrictEqual({});
  });

  it("should work for nested data", () => {
    expect(resolveUserData({ a: { b: 1 }, c: 1 }, ["a.b"])).toStrictEqual({
      a: {
        b: 1,
      },
    });
  });

  it("should work for arrays", () => {
    expect(
      resolveUserData({ a: [{ b: 1 }], pageData: { arrayIndexes: [0] } }, [
        "a#b",
      ]),
    ).toStrictEqual({
      "a#b": 1,
    });
  });

  it("should work for depth-2 nested arrays", () => {
    expect(
      resolveUserData(
        {
          elternteile: [{ kinder: [{ name: "Child A" }, { name: "Child B" }] }],
          pageData: { arrayIndexes: [0, 1] },
        },
        ["elternteile#kinder#name"],
      ),
    ).toStrictEqual({ "elternteile#kinder#name": "Child B" });
  });

  it("should work for depth-3 nested arrays", () => {
    expect(
      resolveUserData(
        {
          a: [{ b: [{ c: [{ d: "deep" }] }] }],
          pageData: { arrayIndexes: [0, 0, 0] },
        },
        ["a#b#c#d"],
      ),
    ).toStrictEqual({ "a#b#c#d": "deep" });
  });

  it("throws an error for invalid lookup", () => {
    expect(() => resolveUserData({ a: [{ b: 1 }] }, ["a#b"])).toThrow(
      expect.anything(),
    );
  });
});

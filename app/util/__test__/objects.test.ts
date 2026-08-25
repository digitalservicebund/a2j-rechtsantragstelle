import { isKeyOfObject, objectMap } from "~/util/objects";

describe("isKeyOfObject", () => {
  it("detects existing keys", () => {
    expect(isKeyOfObject("key", { key: 1 })).toBe(true);
  });

  it("fails on existing keys", () => {
    expect(isKeyOfObject("key1", { key: 1 })).toBe(false);
  });
});

describe("objectMap", () => {
  it("maps objects", () => {
    expect(objectMap({ key: 1 }, (v) => v * 2)).toEqual({ key: 2 });
  });

  it("receives key and index", () => {
    expect(objectMap({ key: 1 }, (_, k, i) => `${k}${i}`)).toEqual({
      key: "key0",
    });
  });
});

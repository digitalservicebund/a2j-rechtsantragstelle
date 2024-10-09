import { dropEachProperty, isKeyOfObject, objectMap } from "~/util/objects";

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

describe("dropEachProperty", () => {
  it("should generate an array of all possible permutations of the object, each missing a key", () => {
    const testContext = {
      vorname: "A",
      nachname: "B",
      geburtsdatum: "1234",
      strasseHausnummer: "abc",
      plz: "12345",
      ort: "ABC",
    };
    const dropped = dropEachProperty(testContext);
    dropped.forEach((context) => {
      expect(Object.keys(context)).not.toEqual(
        expect.arrayContaining(Object.keys(testContext)),
      );
    });
  });
});

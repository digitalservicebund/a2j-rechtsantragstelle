import { arrayIsNonEmpty, removeArrayIndex } from "../array";

describe("arrayIsNonEmpty", () => {
  it("returns true if array is not empty", () => {
    expect(arrayIsNonEmpty([1, 2, 3])).toBe(true);
  });
  it("returns false if array is empty", () => {
    expect(arrayIsNonEmpty([])).toBe(false);
  });
  it("returns false if array is undefined", () => {
    expect(arrayIsNonEmpty()).toBe(false);
  });
  it("returns false if array is null", () => {
    expect(arrayIsNonEmpty(null)).toBe(false);
  });
});

describe("removeArrayIndex", () => {
  it("removes the index from a path", () => {
    expect(removeArrayIndex("flow/step/0/subStep")).toBe("flow/step/subStep");
  });

  it("Removes a two-character index", () => {
    expect(removeArrayIndex("flow/step/00/subStep")).toBe("flow/step/subStep");
  });

  it("doesn't remove anything from a non-index step that includes a numeric character", () => {
    expect(removeArrayIndex("flow/step/sub0Step")).toBe("flow/step/sub0Step");
  });

  it("doesn't remove anything from a step withou an index", () => {
    expect(removeArrayIndex("flow/step/subStep")).toBe("flow/step/subStep");
  });
});

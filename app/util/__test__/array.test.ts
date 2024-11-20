import { arrayIsNonEmpty } from "../array";

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
});

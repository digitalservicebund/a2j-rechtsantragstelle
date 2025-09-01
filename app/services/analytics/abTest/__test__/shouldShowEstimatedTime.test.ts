import {
  shouldShowEstimatedTime,
  validEstimatedTimePathnames,
} from "../shouldShowEstimatedTime";

describe("shouldShowEstimatedTime", () => {
  it("should return true on valid paths", () => {
    validEstimatedTimePathnames.forEach((path) => {
      expect(shouldShowEstimatedTime(path)).toBe(true);
    });
  });
  it("should return false on non-valid paths", () => {
    expect(shouldShowEstimatedTime("/path")).toBe(false);
  });
});

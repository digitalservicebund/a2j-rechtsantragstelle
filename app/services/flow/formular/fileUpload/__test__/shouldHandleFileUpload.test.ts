import { shouldHandleFileUpload } from "../shouldHandleFileUpload";

describe("shouldHandleFileUpload", () => {
  it("should return true for file upload fileUpload actions", () => {
    const actual = shouldHandleFileUpload("fileUpload");
    expect(actual).toBe(true);
  });

  it("should return true for file upload fileUpload/123 actions", () => {
    const actual = shouldHandleFileUpload("fileUpload/123");
    expect(actual).toBe(true);
  });

  it("should return true for file upload deleteFile actions", () => {
    const actual = shouldHandleFileUpload("deleteFile");
    expect(actual).toBe(true);
  });

  it("should return true for file upload deleteFile/123 actions", () => {
    const actual = shouldHandleFileUpload("deleteFile/123");
    expect(actual).toBe(true);
  });

  it("should return false for submitForm upload actions", () => {
    const actual = shouldHandleFileUpload("submitForm");
    expect(actual).toBe(false);
  });

  it("should return false for null upload actions", () => {
    const actual = shouldHandleFileUpload(null);
    expect(actual).toBe(false);
  });
});

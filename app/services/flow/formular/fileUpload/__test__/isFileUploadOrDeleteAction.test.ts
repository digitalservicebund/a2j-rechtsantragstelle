import { isFileUploadOrDeleteAction } from "../isFileUploadOrDeleteAction";

describe("isFileUploadOrDeleteAction", () => {
  it("should return true for file upload fileUpload actions", () => {
    const actual = isFileUploadOrDeleteAction("fileUpload");
    expect(actual).toBe(true);
  });

  it("should return true for file upload fileUpload/123 actions", () => {
    const actual = isFileUploadOrDeleteAction("fileUpload/123");
    expect(actual).toBe(true);
  });

  it("should return true for file upload deleteFile actions", () => {
    const actual = isFileUploadOrDeleteAction("deleteFile");
    expect(actual).toBe(true);
  });

  it("should return true for file upload deleteFile/123 actions", () => {
    const actual = isFileUploadOrDeleteAction("deleteFile/123");
    expect(actual).toBe(true);
  });

  it("should return false for submitForm upload actions", () => {
    const actual = isFileUploadOrDeleteAction("submitForm");
    expect(actual).toBe(false);
  });

  it("should return false for null upload actions", () => {
    const actual = isFileUploadOrDeleteAction(null);
    expect(actual).toBe(false);
  });
});

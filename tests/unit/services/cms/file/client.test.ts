import {
  getContentFilePath,
  loadContentFile,
} from "~/services/cms/file/client";

describe("getContentFilePath", () => {
  it("should return correct directory if no workingDirectory given", async () => {
    expect(getContentFilePath("content.json")).toContain(
      "app/services/cms/content.json"
    );
  });

  it("should return correct directory if workingDirectory given", async () => {
    expect(getContentFilePath("content.json", "directory")).toEqual(
      "directory/content.json"
    );
  });
});

describe("loadContentFile", () => {
  it("should return an error if no file present", async () => {
    expect(() =>
      loadContentFile(getContentFilePath("non-existent.json", __dirname))
    ).toThrow();
  });

  // TODO: provide proper test data
  it.skip("should return the right response data", async () => {
    const result = loadContentFile(
      getContentFilePath("content.json", __dirname)
    );
    expect(result).toEqual({});
  });
});

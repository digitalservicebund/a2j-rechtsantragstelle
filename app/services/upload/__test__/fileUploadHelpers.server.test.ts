import { deleteUserFile } from "../fileUploadHelpers.server";

vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  deleteUserFileFromS3: vi.fn(),
}));

describe("fileUploadHelpers.server", () => {
  describe("deleteUserFile", () => {
    it("should return fileWasDeleted as false if no savedFileKey is present", async () => {
      const actual = await deleteUserFile(
        "deleteFile.test[1]",
        null,
        { test: [{}] },
        "/beratungshilfe/antrag",
      );
      expect(actual.fileWasDeleted).toBe(false);
    });

    it("should return fileWasDeleted as true if savedFileKey is present", async () => {
      const actual = await deleteUserFile(
        "deleteFile.test[0]",
        null,
        { test: [{ savedFileKey: "someValue" }] },
        "/beratungshilfe/antrag",
      );
      expect(actual.fileWasDeleted).toBe(true);
    });
  });
});

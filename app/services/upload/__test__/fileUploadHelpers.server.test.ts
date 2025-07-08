import { deleteUserFile } from "../fileUploadHelpers.server";

vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  deleteUserFileFromS3: vi.fn(),
}));

describe("fileUploadHelpers.server", () => {
  describe("deleteUserFile", () => {
    it("should return false if no savedFileKey is present", async () => {
      const actual = await deleteUserFile(
        "test[1]",
        null,
        { test: [{}] },
        "/beratungshilfe/antrag",
      );
      expect(actual).toBe(false);
    });

    it("should return true if savedFileKey is present", async () => {
      const actual = await deleteUserFile(
        "test[0]",
        null,
        { test: [{ savedFileKey: "someValue" }] },
        "/beratungshilfe/antrag",
      );
      expect(actual).toBe(true);
    });
  });
});

import { getContext } from "~/domains/userData";
import { uploadUserFileToS3 } from "~/services/externalDataStorage/userFileS3Helpers";
import { pdfFileUploadArrayRequiredSchema } from "~/services/validation/pdfFileSchema";
import { deleteUserFile, uploadUserFile } from "../fileUploadHelpers.server";

vi.mock("~/domains/userData");
vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  deleteUserFileFromS3: vi.fn(),
  uploadUserFileToS3: vi.fn(),
}));

describe("fileUploadHelpers.server", () => {
  const savedFileKey = "a-b-c-d-e";
  vi.mocked(uploadUserFileToS3).mockResolvedValue(savedFileKey);
  vi.mocked(getContext).mockReturnValue({
    test: pdfFileUploadArrayRequiredSchema,
  });
  const filename = "file.pdf";
  const fileType = "application/pdf";
  const fileBlob = new Blob(["fileContent"], { type: fileType });
  const fileSize = 11;
  const flowId = "/beratungshilfe/antrag";

  describe("uploadUserFile", () => {
    it("should add a file to userData", async () => {
      const formData = new FormData();
      formData.set("test[0]", fileBlob, filename);

      const actual = await uploadUserFile(
        "test[0]",
        null,
        formData,
        { test: [] },
        flowId,
      );
      expect(actual).toStrictEqual({
        userData: { test: [{ filename, fileType, fileSize, savedFileKey }] },
      });
    });

    it("fails and returns error for bad input", async () => {
      const formData = new FormData();
      const emptyFile = new Blob([], { type: fileType });
      formData.set("test[0]", emptyFile);

      const actual = await uploadUserFile(
        "test[0]",
        null,
        formData,
        { test: [] },
        flowId,
      );
      expect(actual).toStrictEqual({
        fieldErrors: { "test[0]": "fileRequired" },
        repopulateFields: {
          test: [
            { fileSize: 0, fileType: "application/pdf", filename: "blob" },
          ],
        },
      });
    });
  });

  describe("deleteUserFile", () => {
    it("should delete item from userData", async () => {
      const actual = await deleteUserFile(
        "test[0]",
        null,
        { test: [{ savedFileKey: "someValue" }] },
        "/beratungshilfe/antrag",
      );
      expect(actual).toStrictEqual({ test: [] });
    });

    const invalidUserDataMocks = [{}, { test: [] }, { test: [{}] }];
    invalidUserDataMocks.forEach((userDataMock) => {
      it(`should return undefined for invalid userData ${JSON.stringify(userDataMock)}`, async () => {
        const actual = await deleteUserFile(
          "test[0]",
          null,
          userDataMock,
          "/beratungshilfe/antrag",
        );
        expect(actual).toBe(undefined);
      });
    });
  });
});

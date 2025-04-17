import { CSRFKey } from "~/services/security/csrf/csrfKey";
import {
  splitFieldName,
  useFileHandler,
} from "~/services/upload/fileUploadHelpers";
import { downloadUserFile } from "../fileUploadHelpers.server";
import * as s3Utils from "../fileUploadHelpers.server";

const mockFile = new File([], "mockFile");

const useLoaderDataMock = vi.hoisted(() =>
  vi.fn(() => ({
    csrf: "csrf",
  })),
);

const submitMock = vi.fn();
vi.mock("@remix-run/react", () => ({
  useLoaderData: useLoaderDataMock,
  useSubmit: () => submitMock,
}));

describe("fileUploadHelpers", () => {
  describe("useFileHandler", () => {
    it("should return a file upload handler", () => {
      const { onFileUpload } = useFileHandler();
      expect(onFileUpload).toBeDefined();
      expect(useLoaderDataMock).toHaveBeenCalled();
      const mockFormData = new FormData();
      mockFormData.append("_action", `fileUpload.fieldName`);
      mockFormData.append(CSRFKey, "csrf");
      mockFormData.append("fieldName", mockFile);
      onFileUpload("fieldName", mockFile);
      expect(submitMock).toHaveBeenCalledWith(mockFormData, {
        method: "post",
        encType: "multipart/form-data",
      });
    });

    it("should return a file deletion handler", () => {
      const { onFileDelete } = useFileHandler();
      expect(onFileDelete).toBeDefined();
      expect(useLoaderDataMock).toHaveBeenCalled();
      const mockFormData = new FormData();
      mockFormData.append("_action", `deleteFile.fieldName`);
      mockFormData.append(CSRFKey, "csrf");
      onFileDelete("fieldName");
      expect(submitMock).toHaveBeenCalledWith(mockFormData, {
        method: "post",
        encType: "multipart/form-data",
      });
    });
  });

  describe("splitFieldName", () => {
    it("should split a field name into the parent field and the index", () => {
      const { fieldName, inputIndex } = splitFieldName("fieldName[0]");
      expect(fieldName).toEqual("fieldName");
      expect(inputIndex).toEqual(0);
    });

    it("should handle an invalid input name", () => {
      const { fieldName, inputIndex } = splitFieldName("fieldName");
      expect(fieldName).toEqual("fieldName");
      expect(inputIndex).toEqual(NaN);
    });

    it("should handle two-digit indices", () => {
      const { inputIndex } = splitFieldName("fieldName[10]");
      expect(inputIndex).toEqual(10);
    });
  });

  describe("downloadUserFile", () => {
    it("should return a buffer of a file from S3", async () => {
      const mockedBuffer = new Uint8Array([1, 2, 3]);

      vi.spyOn(s3Utils, "downloadUserFile").mockResolvedValue(mockedBuffer);

      const cookieHeader = "testCookieHeader";
      const flowId = "/beratungshilfe/antrag";
      const savedFileKey = "test-savedFileKey";

      const file = await downloadUserFile(cookieHeader, flowId, savedFileKey);
      expect(file).toEqual(mockedBuffer);
      expect(file).toBeInstanceOf(Uint8Array);
    });
  });
});

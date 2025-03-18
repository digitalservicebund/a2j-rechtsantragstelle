import {
  convertFileToMetadata,
  splitFieldName,
  useFileHandler,
} from "~/components/filesUpload/fileUploadHelpers";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

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

  describe("convertFileToMetadata", () => {
    it("should set default values when a file is not provided", () => {
      const result = convertFileToMetadata();
      expect(result).toEqual({
        filename: "",
        fileType: "",
        fileSize: 0,
        createdOn: "",
      });
    });

    it("should successfully convert a file to metadata", () => {
      const mockFile = new File([], "filename", { type: "application/pdf" });
      const result = convertFileToMetadata(mockFile);
      expect(result).toEqual({
        filename: "filename",
        fileType: "application/pdf",
        fileSize: 0,
        createdOn: new Date(mockFile.lastModified).toString(),
      });
    });
  });
});

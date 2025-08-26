import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { useFileHandler } from "../useFileHandler";

const mockFile = new File([], "mockFile");

const { useLoaderDataMock, submitMock } = vi.hoisted(() => ({
  useLoaderDataMock: vi.fn(() => ({ csrf: "csrf" })),
  submitMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("react-router", () => ({
  useLoaderData: useLoaderDataMock,
  useSubmit: () => submitMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

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

    it("should handle undefined file", () => {
      const { onFileUpload } = useFileHandler();
      onFileUpload("fieldName", undefined);
      expect(submitMock).not.toBeCalled();
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
});

import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { useFileHandler } from "../useFileHandler";

const mockFile = new File([], "mockFile");

const useLoaderDataMock = vi.hoisted(() =>
  vi.fn(() => ({
    csrf: "csrf",
  })),
);

const submitMock = vi.fn();
vi.mock("react-router", () => ({
  useLoaderData: useLoaderDataMock,
  useSubmit: () => submitMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fileUploadHelpers", () => {
  describe("useFileHandler", () => {
    it("should return a file upload handler", async () => {
      const { onFileUpload } = useFileHandler();
      expect(onFileUpload).toBeDefined();
      expect(useLoaderDataMock).toHaveBeenCalled();
      const mockFormData = new FormData();
      mockFormData.append("_action", `fileUpload.fieldName`);
      mockFormData.append(CSRFKey, "csrf");
      mockFormData.append("fieldName", mockFile);
      await onFileUpload("fieldName", mockFile);
      expect(submitMock).toHaveBeenCalledWith(mockFormData, {
        method: "post",
        encType: "multipart/form-data",
      });
    });

    it("should handle undefined file", async () => {
      const { onFileUpload } = useFileHandler();

      await onFileUpload("fieldName", undefined);

      expect(submitMock).not.toBeCalled();
    });

    it("should return a file deletion handler", async () => {
      const { onFileDelete } = useFileHandler();
      expect(onFileDelete).toBeDefined();
      expect(useLoaderDataMock).toHaveBeenCalled();
      const mockFormData = new FormData();
      mockFormData.append("_action", `deleteFile.fieldName`);
      mockFormData.append(CSRFKey, "csrf");
      await onFileDelete("fieldName");
      expect(submitMock).toHaveBeenCalledWith(mockFormData, {
        method: "post",
        encType: "multipart/form-data",
      });
    });
  });
});

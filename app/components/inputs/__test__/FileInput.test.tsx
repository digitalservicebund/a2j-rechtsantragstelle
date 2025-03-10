import {
  convertFileToMetadata,
  useFileHandler,
} from "~/components/inputs/FileInput";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

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
const mockFile = new File([], "mockFile");

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

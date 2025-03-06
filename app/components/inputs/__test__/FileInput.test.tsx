import { useFileUploadHandler } from "~/components/inputs/FileInput";
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

describe("useFileUploadHandler", () => {
  it("should return a file upload handler", () => {
    const { onFileUpload } = useFileUploadHandler();
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
});

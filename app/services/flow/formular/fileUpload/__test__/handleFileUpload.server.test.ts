import { createSession } from "react-router";
import {
  deleteUserFile,
  getUpdatedField,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { handleFileUpload } from "../handleFileUpload.server";

vi.mock("~/services/upload/fileUploadHelpers.server", () => ({
  uploadUserFile: vi.fn(),
  deleteUserFile: vi.fn(),
  getUpdatedField: vi.fn(),
}));

const mockRequest = new Request(
  "http://localhost:3000/beratungshilfe/antrag/abgabe/dokumente",
);
const mockSession = createSession();

describe("handleFileUpload", () => {
  it("should return an error when the action is fileUpload and uploadUserFile return an error", async () => {
    vi.mocked(uploadUserFile).mockResolvedValue({
      error: { fieldErrors: { "fileUpload.test": "File upload error" } },
    });

    const actual = await handleFileUpload(
      "fileUpload",
      mockRequest,
      mockSession,
    );

    expect(actual.isErr).toBe(true);
    expect(actual.isErr ? actual.error.fieldErrors : undefined).toEqual({
      "fileUpload.test": "File upload error",
    });
  });

  it("should return ok when the action is fileUpload and uploadUserFile return some result", async () => {
    vi.mocked(uploadUserFile).mockResolvedValue({
      result: { data: { "fileUpload.test": "File uploaded successfully" } },
    });

    const actual = await handleFileUpload(
      "fileUpload",
      mockRequest,
      mockSession,
    );

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value.userData : undefined).toEqual({
      fileUpload: { test: "File uploaded successfully" },
    });
  });

  it("should return ok when the action is deleteFile", async () => {
    vi.mocked(deleteUserFile).mockResolvedValue({ fileWasDeleted: true });
    vi.mocked(getUpdatedField).mockReturnValue({
      fileUpload: { test: "File deleted successfully" },
    });

    const actual = await handleFileUpload(
      "deleteFile",
      mockRequest,
      mockSession,
    );

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value.userData : undefined).toEqual({
      fileUpload: { test: "File deleted successfully" },
    });
  });

  it("should throw an exception when the action unknown", async () => {
    await expect(
      handleFileUpload("anyAnotherAction", mockRequest, mockSession),
    ).rejects.toThrow("Unknown file upload action: anyAnotherAction");
  });
});

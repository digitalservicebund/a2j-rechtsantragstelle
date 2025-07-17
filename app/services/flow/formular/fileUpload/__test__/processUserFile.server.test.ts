import { createSession } from "react-router";
import {
  deleteUserFile,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { processUserFile } from "../processUserFile.server";

vi.mock("~/services/upload/fileUploadHelpers.server", () => ({
  uploadUserFile: vi.fn(),
  deleteUserFile: vi.fn(),
}));

const mockRequest = new Request(
  "http://localhost:3000/beratungshilfe/antrag/abgabe/dokumente",
);
const mockSession = createSession();

describe("processUserFile", () => {
  it("should return an error when the action is fileUpload and uploadUserFile return an error", async () => {
    vi.mocked(uploadUserFile).mockResolvedValue({
      fieldErrors: { "fileUpload.test": "File upload error" },
    });

    const actual = await processUserFile(
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
      userData: { "fileUpload.test": "File uploaded successfully" },
    });

    const actual = await processUserFile(
      "fileUpload",
      mockRequest,
      mockSession,
    );

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value.userData : undefined).toEqual({
      "fileUpload.test": "File uploaded successfully",
    });
  });

  it("should return ok when the action is deleteFile", async () => {
    vi.mocked(deleteUserFile).mockResolvedValue({
      files: [{ name: "File to keep" }],
    });
    const mockDeleteSession = createSession();
    mockDeleteSession.set("files", [
      { name: "File to be deleted" },
      { name: "File to keep" },
    ]);

    const actual = await processUserFile(
      "deleteFile.files[0]",
      mockRequest,
      mockDeleteSession,
    );

    expect(actual.isOk).toBe(true);
    expect(actual.isOk && actual.value.userData).toEqual({
      files: [{ name: "File to keep" }],
    });
  });

  it("should throw an exception when the action unknown", async () => {
    await expect(
      processUserFile("anyAnotherAction", mockRequest, mockSession),
    ).rejects.toThrow("Unknown file upload action: anyAnotherAction");
  });
});

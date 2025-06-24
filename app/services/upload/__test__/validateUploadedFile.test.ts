import { z } from "zod";
import {
  fileUploadLimit,
  type PDFFileMetadata,
  pdfFileMetaDataSchema,
} from "~/services/validation/pdfFileSchema";
import { validateUploadedFile } from "../validateUploadedFile";

describe("validateUploadedFile", () => {
  const fileArraySchema = z
    .array(pdfFileMetaDataSchema)
    .max(fileUploadLimit, "fileLimitReached");

  it("should successfully validate a valid uploaded file", async () => {
    const mockFileMetadata: PDFFileMetadata = {
      filename: "test.pdf",
      fileType: "application/pdf",
      fileSize: 1000,
    };
    const validationResult = await validateUploadedFile(
      "fileArray[0]",
      mockFileMetadata,
      {},
      { fileArray: fileArraySchema },
    );
    expect(validationResult.error).toBeUndefined();
    expect(validationResult.submittedData).toEqual({
      fileArray: [{ ...mockFileMetadata }],
    });
  });

  it("should fail validation for invalid file type", async () => {
    const validationResult = await validateUploadedFile(
      "fileArray[0]",
      {
        filename: "test.pdf",
        fileType: "application/svg+xml",
        fileSize: 1000,
      },
      {},
      { fileArray: fileArraySchema },
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.fieldErrors).toEqual({
      "fileArray[0].fileType": "wrongFileType",
    });
  });

  it("should fail validation for an oversized file", async () => {
    const validationResult = await validateUploadedFile(
      "fileArray[0]",
      {
        filename: "test.pdf",
        fileType: "application/pdf",
        fileSize: 10000000000,
      },
      {},
      { fileArray: fileArraySchema },
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.fieldErrors).toEqual({
      "fileArray[0].fileSize": "fileSizeTooBig",
    });
  });

  it("should fail validation for too many files", async () => {
    const validationResult = await validateUploadedFile(
      "fileArray[6]",
      {
        filename: "test.pdf",
        fileType: "application/pdf",
        fileSize: 10000,
      },
      {},
      { fileArray: fileArraySchema },
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.fieldErrors).toEqual({
      fileArray: "fileLimitReached",
      "fileArray[0]": "Required",
      "fileArray[1]": "Required",
      "fileArray[2]": "Required",
      "fileArray[3]": "Required",
      "fileArray[4]": "Required",
      "fileArray[5]": "Required",
    });
  });
});

import { z } from "zod";
import {
  fileUploadLimit,
  type PDFFileMetadata,
  pdfFileMetaDataSchema,
} from "~/util/file/pdfFileSchema";
import { validateUploadedFile } from "../validateUploadedFile";

describe("validateUploadedFile", () => {
  it("should successfully validate a valid uploaded file", async () => {
    const mockFileMetadata: PDFFileMetadata = {
      filename: "test.pdf",
      fileType: "application/pdf",
      fileSize: 1000,
    };
    const validationResult = await validateUploadedFile(
      "belege[0]",
      mockFileMetadata,
      {
        belege1: [],
      },
      {
        belege1: z
          .array(pdfFileMetaDataSchema)
          .max(fileUploadLimit, "fileLimitReached"),
      },
    );
    expect(validationResult.error).toBeUndefined();
    expect(validationResult.submittedData).toEqual({
      belege: [
        {
          ...mockFileMetadata,
        },
      ],
      belege1: [],
    });
  });

  it("should fail validation for an invalid file", async () => {
    const mockFileMetadata: PDFFileMetadata = {
      filename: "test.pdf",
      fileType: "application/svg+xml",
      fileSize: 1000,
    };
    const validationResult = await validateUploadedFile(
      "belege[0]",
      mockFileMetadata,
      {},
      {
        belege: z
          .array(pdfFileMetaDataSchema)
          .max(fileUploadLimit, "fileLimitReached"),
      },
    );
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.fieldErrors).toEqual({
      "belege[0].fileType": "wrongFileType",
    });
  });
});

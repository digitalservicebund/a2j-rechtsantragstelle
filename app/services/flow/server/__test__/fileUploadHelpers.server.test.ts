import { belegeContext } from "~/domains/shared/formular/abgabe/context";
import {
  buildFileUploadError,
  convertAsyncBufferToFile,
  validateUploadedFile,
} from "~/services/flow/server/fileUploadHelpers.server";
import { fileUploadErrorMap, PDFFileMetadata } from "~/util/file/pdfFileSchema";

describe("File Upload helpers", () => {
  describe("validateUploadedFile", () => {
    it("should successfully validate a valid uploaded file", async () => {
      const mockFileMetadata: PDFFileMetadata = {
        filename: "test.pdf",
        fileType: "application/pdf",
        createdOn: new Date().toString(),
        fileSize: 1000,
      };
      const validationResult = await validateUploadedFile(
        "belege[0]",
        mockFileMetadata,
        {
          belege1: [],
        },
        { ...belegeContext },
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
        createdOn: new Date().toString(),
        fileSize: 1000,
      };
      const validationResult = await validateUploadedFile(
        "belege[0]",
        mockFileMetadata,
        {
          belege1: [],
        },
        { ...belegeContext },
      );
      expect(validationResult.error).toBeDefined();
      expect(validationResult.error?.fieldErrors).toEqual({
        "belege[0].fileType": fileUploadErrorMap.wrongFileType,
      });
    });
  });

  describe("buildFileUploadError", () => {
    it("should format the validation error to what the frontend expects", async () => {
      const errorResult = {
        error: {
          fieldErrors: {
            "belege[0].fileType": "Only PDF and TIFF files allowed",
          },
        },
        data: undefined,
        submittedData: {
          belege: [
            {
              fileType: "invalid",
            },
          ],
        },
      };
      const validationError = buildFileUploadError(errorResult, "belege[0]");
      expect(validationError.ok).toBe(false);
      expect(validationError.status).toBe(422);
      const responseData = await validationError.json();
      expect(responseData).toEqual({
        fieldErrors: {
          ["belege[0]"]: "Only PDF and TIFF files allowed",
        },
        repopulateFields: {
          belege: [
            {
              fileType: "invalid",
            },
          ],
        },
      });
    });
  });

  describe("convertAsyncBufferToFile", () => {
    it("should iterate over an async buffer to create a file", async () => {
      const mockAsyncIterator = {
        async *[Symbol.asyncIterator]() {
          yield* await Promise.resolve([]);
        },
      };
      const result = await convertAsyncBufferToFile(
        mockAsyncIterator,
        "test",
        "application/pdf",
      );
      expect(result.size).toBe(0);
      expect(result.name).toBe("test");
      expect(result.type).toBe("application/pdf");
    });
  });
});

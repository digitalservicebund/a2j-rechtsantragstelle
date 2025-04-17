import { PDFDocument } from "pdf-lib";
import { vi, type Mock } from "vitest";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { downloadUserFile } from "~/services/upload/fileUploadHelpers.server";
import {
  embedUserFilesToPdf,
  extractSavedFileKeys,
} from "../embedUserUploadedFilesToPdf";

vi.mock("~/services/upload/fileUploadHelpers.server", () => ({
  downloadUserFile: vi.fn(),
}));

describe("embedUserUploadedFilesToPdf", () => {
  describe("extractSavedFileKeys", () => {
    it("should extract saved file keys from userData", () => {
      const userData = {
        someField: [{ savedFileKey: "file1" }, { savedFileKey: "file2" }],
        anotherField: [{ savedFileKey: "file3" }],
      } as BeratungshilfeFormularContext;

      const result = extractSavedFileKeys(userData);
      expect(result).toEqual(["file1", "file2", "file3"]);
    });
  });

  describe("embedUserFilesToPdf", () => {
    const cookieHeader = "test-cookie-header";
    const flowId = "/beratungshilfe/antrag";

    let mockMainPDFBuffer: Uint8Array;
    let mockUserPDFBuffer: Uint8Array;

    beforeEach(async () => {
      vi.resetAllMocks();

      // Create main PDF with one page
      const mainPdfDoc = await PDFDocument.create();
      mainPdfDoc.addPage();
      mockMainPDFBuffer = await mainPdfDoc.save();

      // Create PDF from user uploaded file

      const userPdfDoc = await PDFDocument.create();
      userPdfDoc.addPage();
      mockUserPDFBuffer = await userPdfDoc.save();

      // Mock downloadUserFile to return the user PDF buffer
      (downloadUserFile as Mock).mockResolvedValue(mockUserPDFBuffer);
    });

    it("should embed one user uploaded file into the main PDF", async () => {
      const mockedUserData = {
        someField: [{ savedFileKey: "file1" }],
      };

      const resultBuffer = await embedUserFilesToPdf(
        mockMainPDFBuffer,
        mockedUserData as BeratungshilfeFormularContext,
        cookieHeader,
        flowId,
      );

      const resultPdf = await PDFDocument.load(resultBuffer);

      expect(resultPdf.getPageCount()).toBe(2);
      expect(resultBuffer).toBeInstanceOf(Uint8Array);
    });
    it("should embed multiple user uploaded file into the main PDF", async () => {
      const mockedUserData = {
        someField: [{ savedFileKey: "file1" }, { savedFileKey: "file2" }],
        anotherField: [{ savedFileKey: "file3" }],
      };

      const resultBuffer = await embedUserFilesToPdf(
        mockMainPDFBuffer,
        mockedUserData as BeratungshilfeFormularContext,
        cookieHeader,
        flowId,
      );

      const resultPdf = await PDFDocument.load(resultBuffer);

      expect(resultPdf.getPageCount()).toBe(4);
      expect(resultBuffer).toBeInstanceOf(Uint8Array);
    });
  });
});

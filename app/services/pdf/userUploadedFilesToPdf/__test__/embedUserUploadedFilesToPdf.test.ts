import { PDFDocument } from "pdf-lib";
import { vi, type Mock } from "vitest";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";
import { embedUserFilesToPdf } from "../embedUserUploadedFilesToPdf";

vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  downloadUserFileFromS3: vi.fn(),
}));

describe("embedUserUploadedFilesToPdf", () => {
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

      // Mock downloadUserFileFromS3 to return the user PDF buffer
      (downloadUserFileFromS3 as Mock).mockResolvedValue(mockUserPDFBuffer);
    });

    it("should embed one user uploaded file into the main PDF", async () => {
      const mockedUserData = {
        someField: [{ savedFileKey: "file1" }],
      };

      const resultBuffer = await embedUserFilesToPdf(
        mockMainPDFBuffer,
        mockedUserData,
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
        mockedUserData,
        cookieHeader,
        flowId,
      );

      const resultPdf = await PDFDocument.load(resultBuffer);

      expect(resultPdf.getPageCount()).toBe(4);
      expect(resultBuffer).toBeInstanceOf(Uint8Array);
    });
  });
});

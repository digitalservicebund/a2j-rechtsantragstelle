import { PDFDocument } from "pdf-lib";
import { vi, type Mock } from "vitest";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";
import { attachUserUploadedFilesToPdf } from "../attachUserUploadedFilesToPdf";

vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  downloadUserFileFromS3: vi.fn(),
}));

describe("attachUserUploadedFilesToPdf", () => {
  const sessionId = "test-cookie-header";
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

  it("should attach user uploaded file into the main PDF", async () => {
    const mockedUserData: BeratungshilfeFormularContext = {
      buergergeldBeweis: [
        {
          filename: "testfile.pdf",
          fileType: "application/pdf",
          fileSize: 5938,
          savedFileKey: "xyz123-lmn456-opq789",
        },
      ],
      staatlicheLeistungen: "buergergeld",
    };
    const resultBuffer = await attachUserUploadedFilesToPdf(
      mockMainPDFBuffer,
      mockedUserData,
      sessionId,
      flowId,
    );

    const resultPdf = await PDFDocument.load(resultBuffer);

    expect(resultPdf.getPageCount()).toBe(2);
    expect(resultBuffer).toBeInstanceOf(Uint8Array);
  });

  it("should attach multiple user uploaded files into the main PDF", async () => {
    const mockedUserData: BeratungshilfeFormularContext = {
      buergergeldBeweis: [
        {
          filename: "testfile1.pdf",
          fileType: "application/pdf",
          fileSize: 5938,
          savedFileKey: "xyz123-lmn456-opq789",
        },
        {
          filename: "testfile2.pdf",
          fileType: "application/pdf",
          fileSize: 19718,
          savedFileKey: "xyz789-lmn654-opq321",
        },
        {
          filename: "testfile3.pdf",
          fileType: "application/pdf",
          fileSize: 1234,
          savedFileKey: "xyz789-lmn654-opq321",
        },
      ],
      staatlicheLeistungen: "buergergeld",
    };

    const resultBuffer = await attachUserUploadedFilesToPdf(
      mockMainPDFBuffer,
      mockedUserData,
      sessionId,
      flowId,
    );

    const resultPdf = await PDFDocument.load(resultBuffer);

    expect(resultPdf.getPageCount()).toBe(4);
    expect(resultBuffer).toBeInstanceOf(Uint8Array);
  });
});

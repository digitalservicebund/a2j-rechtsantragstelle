import { PDFDocument } from "pdf-lib";
import { vi, type Mock } from "vitest";
import { CheckboxValue } from "~/components/inputs/Checkbox";
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

  it("should return the original PDF buffer if no relevant documents are found", async () => {
    const mockedUserData: BeratungshilfeFormularContext = {
      keineLeistungenBeweis: undefined,
      staatlicheLeistungen: "keine",
    };

    const resultBuffer = await attachUserUploadedFilesToPdf(
      mockMainPDFBuffer,
      mockedUserData,
      sessionId,
      flowId,
    );

    const resultPdf = await PDFDocument.load(resultBuffer);

    expect(resultPdf.getPageCount()).toBe(1);
    expect(resultBuffer).toBeInstanceOf(Uint8Array);
  });

  it("should attach files only for conditions that are true", async () => {
    const mockedUserData: BeratungshilfeFormularContext = {
      keineLeistungenBeweis: [
        {
          filename: "testfile1.pdf",
          fileType: "application/pdf",
          fileSize: 5938,
          savedFileKey: "xyz123-lmn456-opq789",
        },
      ],
      wohngeldBeweis: [
        {
          filename: "testfile2.pdf",
          fileType: "application/pdf",
          fileSize: 19718,
          savedFileKey: "xyz789-lmn654-opq321",
        },
      ],
      staatlicheLeistungen: "keine",
      weitereseinkommen: {
        wohngeld: CheckboxValue.on,
        unterhaltszahlungen: CheckboxValue.off,
        arbeitlosengeld: CheckboxValue.off,
        kindergeld: CheckboxValue.off,
        bafoeg: CheckboxValue.off,
        krankengeld: CheckboxValue.off,
        rente: CheckboxValue.off,
        elterngeld: CheckboxValue.off,
        insolvenzgeld: CheckboxValue.off,
        ueberbrueckungsgeld: CheckboxValue.off,
        others: CheckboxValue.off,
      },
    };

    const resultBuffer = await attachUserUploadedFilesToPdf(
      mockMainPDFBuffer,
      mockedUserData,
      sessionId,
      flowId,
    );

    const resultPdf = await PDFDocument.load(resultBuffer);

    expect(resultPdf.getPageCount()).toBe(3);
    expect(resultBuffer).toBeInstanceOf(Uint8Array);
  });
  it("should not attach files for conditions that are false", async () => {
    const mockedUserData: BeratungshilfeFormularContext = {
      buergergeldBeweis: [
        {
          filename: "testfile1.pdf",
          fileType: "application/pdf",
          fileSize: 5938,
          savedFileKey: "xyz123-lmn456-opq789",
        },
      ],
      staatlicheLeistungen: "asylbewerberleistungen",
    };

    const resultBuffer = await attachUserUploadedFilesToPdf(
      mockMainPDFBuffer,
      mockedUserData,
      sessionId,
      flowId,
    );

    const resultPdf = await PDFDocument.load(resultBuffer);

    expect(resultPdf.getPageCount()).toBe(1);
    expect(resultBuffer).toBeInstanceOf(Uint8Array);
  });
});

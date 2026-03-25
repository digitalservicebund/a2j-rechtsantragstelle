import {
  fluggastrechtePdfFromUserdata,
  KEYWORDS,
  SUBJECT,
  TITLE,
} from "../fluggastrechtePdfFromUserdata";
import { userDataMock } from "./userDataMock";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "~/services/pdf/footer/createFooter";
import { createFirstPage } from "~/domains/fluggastrechte/services/pdf/sections/firstPage/createFirstPage";
import { createReasonPage } from "~/domains/fluggastrechte/services/pdf/sections/reason/createReasonPage";
import { createBankInformation } from "~/domains/fluggastrechte/services/pdf/sections/createBankInformation";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";

vi.mock("~/services/pdf/pdfFromUserData", () => ({
  pdfFromUserData: vi.fn(),
}));

vi.mock("~/services/pdf/footer/createFooter", () => ({
  createFooter: vi.fn(),
}));

vi.mock(
  "~/domains/fluggastrechte/services/pdf/sections/firstPage/createFirstPage",
  () => ({
    createFirstPage: vi.fn(),
  }),
);

vi.mock(
  "~/domains/fluggastrechte/services/pdf/sections/reason/createReasonPage",
  () => ({
    createReasonPage: vi.fn(),
  }),
);

vi.mock("~/services/pdf/setPdfMetadata", () => ({
  setPdfMetadata: vi.fn(),
}));

describe("fluggastrechtePdfFromUserdata", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("exposes expected metadata constants", () => {
    expect(TITLE).toBe("Klage Neueingang");
    expect(SUBJECT).toBe("Klageschrift");
    expect(KEYWORDS).toBe("Fluggastrechte");
  });

  it.each([true, false])(
    "builds PDF document and forwards showFGROnlineVerfahren=%s",
    async (showFGROnlineVerfahren) => {
      const expectedPdf = Buffer.from("test-pdf");
      vi.mocked(pdfFromUserData).mockResolvedValue(expectedPdf);

      const result = await fluggastrechtePdfFromUserdata(userDataMock, {
        showFGROnlineVerfahren,
      });

      expect(result).toBe(expectedPdf);
      expect(pdfFromUserData).toHaveBeenCalledWith(
        userDataMock,
        expect.any(Function),
      );

      const buildPdfDocument = vi.mocked(pdfFromUserData).mock.calls[0][1];
      const mockStruct = mockPdfKitDocumentStructure();
      const mockDoc = mockPdfKitDocument(mockStruct);

      buildPdfDocument(mockDoc, mockStruct, userDataMock);

      expect(setPdfMetadata).toHaveBeenCalledWith(mockDoc, {
        title: TITLE,
        subject: SUBJECT,
        keywords: KEYWORDS,
      });
      expect(createFirstPage).toHaveBeenCalledWith(
        mockDoc,
        mockStruct,
        userDataMock,
        showFGROnlineVerfahren,
      );
      expect(mockDoc.addPage).toHaveBeenCalledTimes(1);
      expect(createReasonPage).toHaveBeenCalledWith(
        mockDoc,
        mockStruct,
        userDataMock,
      );
      expect(createFooter).toHaveBeenCalledWith(
        mockDoc,
        mockStruct,
        userDataMock,
        createBankInformation,
      );
    },
  );
});

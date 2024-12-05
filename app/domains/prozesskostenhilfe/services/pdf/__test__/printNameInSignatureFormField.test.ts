import type { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { customPdfFormFont } from "~/services/pdf/fillPdf.server";
import { printNameInSignatureFormField } from "../printNameInSignatureFormField";

vi.mock("pdf-lib", async () => {
  const original = await vi.importActual("pdf-lib");
  return {
    ...original,
    PDFDocument: vi.fn(() => ({
      getPage: vi.fn(),
    })),
  };
});

const mockPdfDoc = {
  getPage: vi.fn().mockReturnValue({
    drawText: vi.fn(),
  }),
} as unknown as PDFDocument;

const userData: ProzesskostenhilfeFormularContext = {
  vorname: "Rosa",
  nachname: "Ritter",
  versandArt: "digital",
};

describe("printNameInSignatureFormField", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call drawText with correct arguments when versandArt is "digital"', () => {
    printNameInSignatureFormField(mockPdfDoc, userData);

    expect(mockPdfDoc.getPage(3).drawText).toHaveBeenCalledWith("Rosa Ritter", {
      x: 200,
      y: 75,
      size: 10,
      font: customPdfFormFont,
    });
  });

  it('should not call drawText when versandArt is "analog"', () => {
    const userDataAnalog: ProzesskostenhilfeFormularContext = {
      ...userData,
      versandArt: "analog",
    };

    printNameInSignatureFormField(mockPdfDoc, userDataAnalog);

    expect(mockPdfDoc.getPage(3).drawText).not.toHaveBeenCalled();
  });
});

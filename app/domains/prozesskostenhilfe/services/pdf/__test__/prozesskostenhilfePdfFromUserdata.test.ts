import { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { addMetadataToPdf } from "~/services/pdf/addMetadataToPdf";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillPdf } from "~/services/pdf/fillPdf.server";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { prozesskostenhilfePdfFromUserdata } from "..";
import loadHinweisblatt from "../loadHinweisblatt";

vi.mock("~/services/pdf/fillOutFunction", () => ({
  pdfFillReducer: vi.fn(),
}));
vi.mock("~/services/pdf/fillPdf.server", () => ({
  fillPdf: vi.fn(),
}));
vi.mock("~/services/pdf/addMetadataToPdf", () => ({
  addMetadataToPdf: vi.fn(),
}));
vi.mock("~/services/pdf/appendPagesToPdf", () => ({
  appendPagesToPdf: vi.fn(),
}));
vi.mock("~/services/pdf/pdfFromUserData", () => ({
  pdfFromUserData: vi.fn(),
}));
vi.mock("../loadHinweisblatt", () => ({
  default: vi.fn(),
}));

const userData: ProzesskostenhilfeFormularContext = {
  vorname: "Angelika",
  nachname: "M",
};

describe("prozesskostenhilfePdfFromUserdata", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call all expected functions", async () => {
    const mockPdfDocument = await PDFDocument.create();
    const pdfBytes = await mockPdfDocument.save();
    const mockPdfBuffer = Buffer.from(pdfBytes);
    const mockUint8Array = new Uint8Array(pdfBytes);

    vi.mocked(pdfFillReducer).mockReturnValue({
      pdfValues: {},
      attachment: [],
    });
    vi.mocked(fillPdf).mockResolvedValue(mockPdfDocument);
    vi.mocked(addMetadataToPdf).mockReturnValue(mockPdfDocument);
    vi.mocked(pdfFromUserData).mockResolvedValue(mockPdfBuffer);
    vi.mocked(appendPagesToPdf).mockResolvedValue(mockUint8Array);
    vi.mocked(loadHinweisblatt).mockResolvedValue(mockPdfDocument);

    await prozesskostenhilfePdfFromUserdata(userData);

    expect(pdfFillReducer).toHaveBeenCalled();
    expect(fillPdf).toHaveBeenCalled();
    expect(addMetadataToPdf).toHaveBeenCalled();
    expect(appendPagesToPdf).toHaveBeenCalled();
    expect(loadHinweisblatt).toHaveBeenCalled();
  });
});

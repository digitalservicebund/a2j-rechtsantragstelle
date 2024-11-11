import PDFDocument from "pdfkit";
import {
  createPdfKitDocument,
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  LINE_GAP_GLOBAL,
  PDF_LANGUAGE,
  PDF_MARGIN_HORIZONTAL,
  PDF_MARGIN_VERTICAL,
  PDF_SIZE_FORMAT,
  PDF_VERSION,
} from "~/services/pdf/createPdfKitDocument";

vi.mock("pdfkit", () => {
  return {
    default: vi.fn(),
  };
});

describe("createPdfKitDocument", () => {
  let mockDocument: unknown;

  beforeEach(() => {
    mockDocument = {
      registerFont: vi.fn(),
      lineGap: vi.fn(),
    };

    vi.mocked(PDFDocument).mockImplementation(
      () => mockDocument as PDFKit.PDFDocument,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a PDFDocument with the correct configuration", () => {
    const mockRegularFont = new ArrayBuffer(8);
    const mockBoldFont = new ArrayBuffer(8);

    const document = createPdfKitDocument(mockRegularFont, mockBoldFont);

    expect(PDFDocument).toHaveBeenCalledWith({
      bufferPages: true,
      pdfVersion: PDF_VERSION,
      lang: PDF_LANGUAGE,
      tagged: true,
      displayTitle: true,
      size: PDF_SIZE_FORMAT,
      margins: {
        top: PDF_MARGIN_VERTICAL,
        left: PDF_MARGIN_HORIZONTAL,
        right: PDF_MARGIN_HORIZONTAL,
        bottom: PDF_MARGIN_VERTICAL,
      },
      fontLayoutCache: true,
      subset: "PDF/UA",
      permissions: {
        annotating: true,
        printing: "highResolution",
        fillingForms: true,
        contentAccessibility: true,
      },
    });

    expect(document).toBe(mockDocument);
  });

  it("should register the fonts and line gap correctly", () => {
    const mockRegularFont = new ArrayBuffer(8);
    const mockBoldFont = new ArrayBuffer(8);

    createPdfKitDocument(mockRegularFont, mockBoldFont);

    expect(
      (mockDocument as PDFKit.PDFDocument).registerFont,
    ).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR, mockRegularFont);
    expect(
      (mockDocument as PDFKit.PDFDocument).registerFont,
    ).toHaveBeenCalledWith(FONTS_BUNDESSANS_BOLD, mockBoldFont);
    expect((mockDocument as PDFKit.PDFDocument).lineGap).toHaveBeenCalledWith(
      LINE_GAP_GLOBAL,
    );
  });
});

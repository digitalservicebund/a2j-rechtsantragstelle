import PDFDocument from "pdfkit";
import {
  createPdfKitDocument,
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_LANGUAGE,
  PDF_MARGIN,
  PDF_SIZE_FORMAT,
  PDF_VERSION,
} from "../createPdfKitDocument";

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
      pdfVersion: PDF_VERSION,
      lang: PDF_LANGUAGE,
      tagged: true,
      displayTitle: true,
      size: PDF_SIZE_FORMAT,
      margin: PDF_MARGIN,
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

  it("should register the fonts correctly", () => {
    const mockRegularFont = new ArrayBuffer(8);
    const mockBoldFont = new ArrayBuffer(8);

    createPdfKitDocument(mockRegularFont, mockBoldFont);

    expect(
      (mockDocument as PDFKit.PDFDocument).registerFont,
    ).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR, mockRegularFont);
    expect(
      (mockDocument as PDFKit.PDFDocument).registerFont,
    ).toHaveBeenCalledWith(FONTS_BUNDESSANS_BOLD, mockBoldFont);
  });
});

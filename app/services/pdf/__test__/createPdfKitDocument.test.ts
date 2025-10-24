import PDFDocument from "pdfkit";
import {
  createPdfKitDocument,
  LINE_GAP_GLOBAL,
  PDF_LANGUAGE,
  PDF_MARGIN_HORIZONTAL,
  PDF_MARGIN_VERTICAL,
  PDF_SIZE_FORMAT,
  PDF_VERSION,
} from "~/services/pdf/createPdfKitDocument";

vi.mock("pdfkit", () => {
  const MockPDFDocument = vi.fn(function (this: any) {
    this.registerFont = vi.fn();
    this.lineGap = vi.fn();
  });

  return { default: MockPDFDocument };
});

describe("createPdfKitDocument", () => {
  beforeEach(() => {
    (PDFDocument as any).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a PDFDocument with the correct configuration", () => {
    const document = createPdfKitDocument();

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

    expect(document).toBeInstanceOf(PDFDocument as any);
  });

  it("should register the fonts and line gap correctly", () => {
    createPdfKitDocument();

    const instance = (PDFDocument as any).mock.instances[0];

    expect(instance.registerFont).toHaveBeenCalled();
    expect((instance as PDFKit.PDFDocument).lineGap).toHaveBeenCalledWith(
      LINE_GAP_GLOBAL,
    );
  });
});

import PDFDocument from "pdfkit";

export const PDF_VERSION = "1.7";
export const PDF_LANGUAGE = "de-DE";
export const PDF_SIZE_FORMAT = "A4";
export const FONTS_BUNDESSANS_REGULAR = "BundesSansWebRegular";
export const FONTS_BUNDESSANS_BOLD = "BundesSansWebBold";
export const PDF_MARGIN = 70;
export const PDF_MARGIN_VERTICAL = 50; // For top and bottom
export const PDF_MARGIN_HORIZONTAL = 70; // For left and right
export const PDF_HEIGHT_SEIZE = 760;
export const LINE_GAP_GLOBAL = 1.5;

export const createPdfKitDocument = (
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  const document = new PDFDocument({
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
    subset: "PDF/UA" as PDFKit.Mixins.PDFSubsets, // PDFKit uses DefinitelyTyped and it's not updated yet
    permissions: {
      annotating: true,
      printing: "highResolution",
      fillingForms: true,
      contentAccessibility: true,
    },
  });

  // Register fonts
  document.registerFont(FONTS_BUNDESSANS_REGULAR, bundesSansWebRegular);
  document.registerFont(FONTS_BUNDESSANS_BOLD, bundesSansWebBold);
  document.lineGap(LINE_GAP_GLOBAL);

  return document;
};

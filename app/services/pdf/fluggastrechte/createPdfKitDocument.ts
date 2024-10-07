import PDFDocument from "pdfkit";

export const PDF_VERSION = "1.7";
export const PDF_LANGUAGE = "de-DE";
export const PDF_SIZE_FORMAT = "A4";
export const FONTS_BUNDESSANS_REGULAR = "BundesSansWebRegular";
export const FONTS_BUNDESSANS_BOLD = "BundesSansWebBold";
export const PDF_MARGIN = 70;
export const PDF_HEIGHT_SEIZE = 760;

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
    margin: PDF_MARGIN,
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

  return document;
};

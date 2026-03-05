import PDFDocument from "pdfkit";
import { readRelativeFileToBuffer } from "./readRelativeFileToBuffer";

export const PDF_VERSION = "1.7";
export const PDF_LANGUAGE = "de-DE";
export const PDF_SIZE_FORMAT = "A4";
export const FONTS_BUNDESSANS_REGULAR = "BundesSansDTPRegular";
export const FONTS_BUNDESSANS_BOLD = "BundesSansDTPBold";
export const PDF_MARGIN_VERTICAL = 50;
export const PDF_MARGIN_HORIZONTAL = 70;
export const PDF_HEIGHT_SEIZE = 780;
export const PDF_WIDTH_SEIZE = 460;
export const LINE_GAP_GLOBAL = 2;

const bundesSansDTPRegular = await readRelativeFileToBuffer(
  "public/fonts/BundesSans-DTP-Regular.otf",
);
const bundesSansDTPBold = await readRelativeFileToBuffer(
  "public/fonts/BundesSans-DTP-Bold.otf",
);

export const createPdfKitDocument = () => {
  const document = new PDFDocument({
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
    subset: "PDF/UA" as PDFKit.Mixins.PDFSubsets, // PDFKit uses DefinitelyTyped and it's not updated yet
    permissions: {
      annotating: true,
      printing: "highResolution",
      fillingForms: true,
      contentAccessibility: true,
    },
  });

  // Register fonts
  document.registerFont(FONTS_BUNDESSANS_REGULAR, bundesSansDTPRegular);
  document.registerFont(FONTS_BUNDESSANS_BOLD, bundesSansDTPBold);
  document.lineGap(LINE_GAP_GLOBAL);

  return document;
};

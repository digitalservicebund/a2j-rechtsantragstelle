import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN,
} from "../createPdfKitDocument";

export const createPageNumber = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
) => {
  const range = doc.bufferedPageRange();

  const pageNumber = range.start + range.count;

  footerSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(7)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`${pageNumber}/3`, 585 - PDF_MARGIN, PDF_HEIGHT_SEIZE, {
          align: "right",
        });
    }),
  );
};

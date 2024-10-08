import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN,
} from "../createPdfKitDocument";

export const createPageNumber = (
  doc: typeof PDFDocument,
  { pageNumber }: { pageNumber: number },
) => {
  doc
    .fontSize(7)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(`${pageNumber}/3`, 585 - PDF_MARGIN, PDF_HEIGHT_SEIZE, {
      align: "right",
    });
};

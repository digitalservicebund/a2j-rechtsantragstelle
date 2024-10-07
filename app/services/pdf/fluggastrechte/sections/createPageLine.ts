import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE, PDF_MARGIN } from "../createPdfKitDocument";

export const createPageNumber = (
  doc: typeof PDFDocument,
  { pageNumber }: { pageNumber: number },
) => {
  doc.fontSize(7).text(`${pageNumber}/3`, 585 - PDF_MARGIN, PDF_HEIGHT_SEIZE, {
    align: "right",
  });
};

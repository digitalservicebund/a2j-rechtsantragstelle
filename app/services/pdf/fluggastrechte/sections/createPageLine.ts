import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE, PDF_MARGIN } from "../createPdfKitDocument";

export const createPageLine = (
  doc: typeof PDFDocument,
  currentLine: number,
) => {
  doc.fontSize(7).text(`${currentLine}/3`, 585 - PDF_MARGIN, PDF_HEIGHT_SEIZE, {
    align: "right",
  });
};

import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE } from "../../createPdfKitDocument";

const MAX_VERTICAL_SPACE = PDF_HEIGHT_SEIZE - 90;

export const addNewPageInCaseMissingVerticalSpace = (
  doc: typeof PDFDocument,
): void => {
  if (doc.y >= MAX_VERTICAL_SPACE) {
    doc.addPage();
  }
};

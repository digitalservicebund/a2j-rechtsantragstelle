import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE } from "~/services/pdf/createPdfKitDocument";

export const MAX_VERTICAL_SPACE = PDF_HEIGHT_SEIZE - 50;

export const addNewPageInCaseMissingVerticalSpace = (
  doc: typeof PDFDocument,
  extraYPosition = 0,
): void => {
  if (doc.y + extraYPosition >= MAX_VERTICAL_SPACE) {
    doc.addPage();
  }
};

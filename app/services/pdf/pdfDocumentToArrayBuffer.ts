import type { PDFDocument } from "pdf-lib";

export const pdfDocumentToArrayBuffer = async (document: PDFDocument) => {
  return await document.save();
};

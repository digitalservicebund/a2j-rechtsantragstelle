import type { PDFDocument } from "pdf-lib";

/**
 * Appends one PDF to another.
 * @param primaryPdfDocument The main PDF to which the other one will be appended to
 * @param secondaryPdfDocument The PDF which will be appended to the main PDF
 * @returns Promise holding an Uint8Array of the merged PDF
 */
export async function appendPdfToPdf(
  primaryPdfDocument: PDFDocument,
  secondaryPdfDocument: PDFDocument,
): Promise<Uint8Array> {
  const copiedPages = await primaryPdfDocument.copyPages(
    secondaryPdfDocument,
    secondaryPdfDocument.getPageIndices(),
  );

  copiedPages.forEach((page) =>
    primaryPdfDocument.insertPage(primaryPdfDocument.getPageCount(), page),
  );

  const mergedPdf = await primaryPdfDocument.save();
  return mergedPdf;
}

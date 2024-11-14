import type { PDFDocument } from "pdf-lib";

/**
 * Appends one PDF to another.
 * @param primaryPdf The main PDF to which the other one will be appended to
 * @param secondaryPdf The PDF which will be appended to the main PDF
 * @returns Promise holding an Uint8Array of the merged PDF
 */
export async function appendPagesToPdf(
  primaryPdf: PDFDocument,
  secondaryPdf: PDFDocument,
): Promise<Uint8Array> {
  const copiedPages = await primaryPdf.copyPages(
    secondaryPdf,
    secondaryPdf.getPageIndices(),
  );

  copiedPages.forEach((page) =>
    primaryPdf.insertPage(primaryPdf.getPageCount(), page),
  );

  const mergedPdf = await primaryPdf.save();
  return mergedPdf;
}

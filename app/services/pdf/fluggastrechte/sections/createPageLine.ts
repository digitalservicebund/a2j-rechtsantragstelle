import type PDFDocument from "pdfkit";

export const createPageLine = (
  doc: typeof PDFDocument,
  currentLine: number,
) => {
  doc.fontSize(7).text(`${currentLine}/3`, 585 - 70, 760, { align: "right" });
};

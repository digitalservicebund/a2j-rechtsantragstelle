import type PDFDocument from "pdfkit";

export const createMainTitle = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  doc.fontSize(31).font(bundesSansWebBold).text("Klage", { align: "left" });
  doc.fontSize(10).font(bundesSansWebRegular).text("Neueingang");
};

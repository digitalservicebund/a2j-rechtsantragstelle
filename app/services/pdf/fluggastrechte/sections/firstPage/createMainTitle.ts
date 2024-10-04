import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

export const createMainTitle = (doc: typeof PDFDocument) => {
  doc.fontSize(31).font(FONTS_BUNDESSANS_BOLD).text("Klage", { align: "left" });
  doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text("Neueingang");
};

import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

export const createMainTitle = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const mainTitleSect = doc.struct("Sect");
  mainTitleSect.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(31)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Klage", { align: "left" });
    }),
  );
  mainTitleSect.add(
    doc.struct("P", {}, () => {
      doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text("Neueingang");
    }),
  );
  documentStruct.add(mainTitleSect);
};

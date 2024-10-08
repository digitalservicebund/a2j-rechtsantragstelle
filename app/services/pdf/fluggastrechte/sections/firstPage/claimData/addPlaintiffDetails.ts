import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

export const PLAINTIFF_TEXT = "– Klagende Partei –";

export const addPlaintiffDetails = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const plaintiffSect = doc.struct("Sect");
  plaintiffSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Włodzimierz Ciesiński", { continued: true });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(" | Musterstr. 3, 12345 Musterhausen");
      doc.text("0176 30441234");
      doc.text(PLAINTIFF_TEXT, { align: "left" });
    }),
  );
  documentStruct.add(plaintiffSect);
};

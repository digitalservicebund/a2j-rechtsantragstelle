import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

export const CREATION_DATE_PDF_TEXT = "Erstellt am: 04.10.2024";
export const TO_THE_COURT_TEXT = "An das";

export const createLocalCourtAndDate = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const localCourtHeaderSect = doc.struct("Sect");
  localCourtHeaderSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(CREATION_DATE_PDF_TEXT, { align: "right" });
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TO_THE_COURT_TEXT, { align: "left" });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Amtsgericht Königs Wusterhausen", { align: "left" });
      doc.text("Schlossplatz 4", { align: "left" });
      doc.text("15711 Königs Wusterhausen", { align: "left" });
    }),
  );
  documentStruct.add(localCourtHeaderSect);
};

import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN,
} from "../../../createPdfKitDocument";

export const addDetailedReason = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const detailedReasonSect = doc.struct("Sect");
  detailedReasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text("Die klagende Partei war pünktlich zum Check-in.", PDF_MARGIN)
        .text(
          "Der Flug von Berlin Brandenburg Flughafen (BER) nach Athens International Airport (ATH) hatte die genannte Verspätung.",
        );
    }),
  );
  documentStruct.add(detailedReasonSect);
};

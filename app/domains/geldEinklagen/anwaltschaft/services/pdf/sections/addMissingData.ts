import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const addMissingData = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  field: string,
) => {
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(9)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`Fehlende Angaben: ${field}`, PDF_MARGIN_HORIZONTAL);
      doc.moveDown(0.5);
    }),
  );
};

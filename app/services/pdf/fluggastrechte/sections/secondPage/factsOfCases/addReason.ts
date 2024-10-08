import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

export const addReason = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          "Die klagende Partei buchte den folgenden Flug, der von der beklagten Partei ",
          { continued: true },
        )
        .font(FONTS_BUNDESSANS_BOLD)
        .text("nicht pünktlich ausgeführt ", { continued: true })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("wurde:");
    }),
  );
  documentStruct.add(reasonSect);
};

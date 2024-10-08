import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
} from "../createPdfKitDocument";

export const STAMP_TEXT =
  "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

export const STAMP_TEXT_WIDTH = 188;
const STAMP_TEXT_HEIGHT = 20;

export const createStamp = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  // Artifact Section for the stamp
  const stampSect = doc.struct("Sect");
  stampSect.add(
    doc.struct("P", {}, () => {
      doc
        .save()
        .fontSize(8)
        .rotate(-90, { origin: [50, 780] })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(STAMP_TEXT, STAMP_TEXT_HEIGHT * 3, PDF_HEIGHT_SEIZE, {
          align: "center",
          width: STAMP_TEXT_WIDTH,
          baseline: "middle",
        })
        .rect(STAMP_TEXT_HEIGHT * 3, 750, STAMP_TEXT_WIDTH, STAMP_TEXT_HEIGHT)
        .stroke()
        .restore();
    }),
  );
  documentStruct.add(stampSect);
};

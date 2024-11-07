import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  PDF_HEIGHT_SEIZE,
} from "../createPdfKitDocument";

export const STAMP_TEXT =
  "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

export const STAMP_TEXT_WIDTH = 188;
const STAMP_TEXT_HEIGHT = 20;

export const createStamp = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
) => {
  footerSect.add(
    doc.struct("P", {}, () => {
      doc
        .save()
        .fontSize(8)
        .rotate(-90, { origin: [55, 770] })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(STAMP_TEXT, STAMP_TEXT_HEIGHT * 2, PDF_HEIGHT_SEIZE - 20, {
          align: "center",
          width: STAMP_TEXT_WIDTH,
          baseline: "middle",
        })
        .rect(STAMP_TEXT_HEIGHT * 2, 750, STAMP_TEXT_WIDTH, STAMP_TEXT_HEIGHT)
        .stroke()
        .restore();
    }),
  );
};

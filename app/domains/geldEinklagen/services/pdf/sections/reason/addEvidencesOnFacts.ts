import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const EVIDENCES_ON_FACTS_TEXT = "II. Beweise";

export const addEvidencesOnFacts = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  beweiseBeschreibung: string,
) => {
  if (!beweiseBeschreibung) {
    return;
  }

  reasonSect.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(EVIDENCES_ON_FACTS_TEXT);
      doc.moveDown(1);
    }),
  );

  reasonSect.add(
    doc.struct("P", {}, () => {
      doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text(beweiseBeschreibung);
    }),
  );

  doc.moveDown(1.5);
};

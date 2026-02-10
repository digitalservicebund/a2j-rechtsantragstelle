import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

const EVIDENCES_ON_FACTS_TEXT = "II. Beweismittel zum Sachverhalt";

export const addEvidencesOnFacts = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
) => {
  reasonSect.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(EVIDENCES_ON_FACTS_TEXT);
      doc.moveDown(1);
    }),
  );
  doc.moveDown(1.5);
};

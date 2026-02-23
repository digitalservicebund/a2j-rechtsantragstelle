import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

const FACTS_OF_CASES_TEXT = "I. Sachverhalt";

export const addFactsOfCases = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
) => {
  reasonSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(FACTS_OF_CASES_TEXT);
      doc.moveDown(1);
    }),
  );
  doc.moveDown(1.5);
};

import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const FACTS_OF_CASES_TEXT = "I. Sachverhalt";

export const addFactsOfCases = (
  doc: PDFKit.PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  sachverhaltBegruendung: string,
) => {
  reasonSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(FACTS_OF_CASES_TEXT);
      doc.moveDown(1);
    }),
  );

  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(sachverhaltBegruendung ?? "");
    }),
  );

  doc.moveDown(1.5);
};

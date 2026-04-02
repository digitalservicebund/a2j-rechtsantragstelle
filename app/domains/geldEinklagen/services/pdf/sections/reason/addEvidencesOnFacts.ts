import type PDFDocument from "pdfkit";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

const EVIDENCES_ON_FACTS_TEXT = "II. Beweise";

export const addEvidencesOnFacts = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  beweiseBeschreibung: string,
) => {
  if (!beweiseBeschreibung) {
    return;
  }

  const evidencesOnFactsTextHeight = getHeightOfString(
    EVIDENCES_ON_FACTS_TEXT,
    doc,
    PDF_WIDTH_SEIZE,
  );

  // We need to check if there is enough space for the "Beweise" title and the following text below
  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: evidencesOnFactsTextHeight,
    moveDownFactor: 1,
  });

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

import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addFactsOfCases } from "./addFactsOfCases";
import { addEvidencesOnFacts } from "./addEvidencesOnFacts";
import { createLegalAssessment } from "./legalAssessment/createLegalAssessment";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

const REASON_TITLE_TEXT = "Begründung";

export const createReasonPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const pages = doc.bufferedPageRange();

  // If the document is on the first page, we need to add a new page for the reason section
  if (pages.count === 1) {
    doc.addPage();
  }

  const reasonSect = doc.struct("Sect");

  reasonSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(16).font(FONTS_BUNDESSANS_BOLD).text(REASON_TITLE_TEXT, {
        align: "left",
      });
      doc.moveDown(1.5);
    }),
  );

  documentStruct.add(reasonSect);

  addFactsOfCases(doc, reasonSect);
  addEvidencesOnFacts(doc, reasonSect);
  createLegalAssessment(doc, reasonSect, userData);
};

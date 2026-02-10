import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addAdvanceCourtAndPlaintiffName } from "./addAdvanceCourtAndPlaintiffName";
import { addRechtlicheWuerdigung } from "./addRechtlicheWuerdigung";
import { addDisputeResolution } from "./addDisputeResolution";

const LEGAL_ASSESSMENT_TEXT = "III. Rechtliche Würdigung";

export const createLegalAssessment = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const legalAssessmentSect = doc.struct("Sect");

  legalAssessmentSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(LEGAL_ASSESSMENT_TEXT);
      doc.moveDown(1);
    }),
  );

  reasonSect.add(legalAssessmentSect);

  addRechtlicheWuerdigung(doc, legalAssessmentSect, userData);

  addDisputeResolution(doc, legalAssessmentSect, userData);

  addAdvanceCourtAndPlaintiffName(
    doc,
    reasonSect,
    legalAssessmentSect,
    userData,
  );
};

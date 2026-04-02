import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addAdvanceCourtText } from "./addAdvanceCourtText";
import { addRechtlicheWuerdigung } from "./addRechtlicheWuerdigung";
import { addDisputeResolution } from "./addDisputeResolution";
import { addSignature } from "./addSignature";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";

const getLegalAssessmentTitle = (hasEvidencesOnFacts: boolean) =>
  `${hasEvidencesOnFacts ? "III" : "II"}. Rechtliche Würdigung`;

export const createLegalAssessment = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
  hasEvidencesOnFacts: boolean,
) => {
  const legalAssessmentSect = doc.struct("Sect");

  const legalAssessmentTitle = getLegalAssessmentTitle(hasEvidencesOnFacts);

  const evidencesOnFactsTextHeight = getHeightOfString(
    legalAssessmentTitle,
    doc,
    PDF_WIDTH_SEIZE,
  );

  // We need to check if there is enough space for the "Rechtliche Würdigung" title and the following texts below
  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: evidencesOnFactsTextHeight,
    moveDownFactor: 1,
  });

  legalAssessmentSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(legalAssessmentTitle);
      doc.moveDown(1);
    }),
  );

  reasonSect.add(legalAssessmentSect);

  addRechtlicheWuerdigung(doc, legalAssessmentSect, userData);

  addDisputeResolution(doc, legalAssessmentSect, userData);

  addAdvanceCourtText(doc, legalAssessmentSect, userData);

  addSignature(doc, reasonSect, userData);
};

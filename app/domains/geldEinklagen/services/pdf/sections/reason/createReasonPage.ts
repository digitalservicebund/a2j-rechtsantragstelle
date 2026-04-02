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

  addFactsOfCases(doc, reasonSect, userData.sachverhaltBegruendung ?? "");
  const hasEvidencesOnFacts = userData.beweiseAngebot === "yes";
  addEvidencesOnFacts(doc, reasonSect, userData.beweiseBeschreibung ?? "");
  createLegalAssessment(doc, reasonSect, userData, hasEvidencesOnFacts);
};

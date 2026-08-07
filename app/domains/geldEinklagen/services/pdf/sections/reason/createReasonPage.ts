import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { createLegalAssessment } from "./legalAssessment/createLegalAssessment";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { createFactsOfCase } from "./factsOfCase/createFactsOfCase";

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

  createFactsOfCase(doc, reasonSect, userData);
  createLegalAssessment(doc, reasonSect, userData);
};

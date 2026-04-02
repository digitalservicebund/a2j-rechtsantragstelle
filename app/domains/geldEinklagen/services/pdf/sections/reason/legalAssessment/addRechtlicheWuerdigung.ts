import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { FONTS_BUNDESSANS_REGULAR } from "~/services/pdf/createPdfKitDocument";

export function addRechtlicheWuerdigung(
  doc: PDFKit.PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  { rechtlicheWuerdigung }: GeldEinklagenFormularUserData,
) {
  if (rechtlicheWuerdigung) {
    legalAssessmentSect.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(rechtlicheWuerdigung)
          .moveDown(1);
      }),
    );
  }
}

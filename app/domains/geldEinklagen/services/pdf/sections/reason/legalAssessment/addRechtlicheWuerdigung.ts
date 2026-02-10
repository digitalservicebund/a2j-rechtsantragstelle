import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

export function addRechtlicheWuerdigung(
  doc: PDFKit.PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  { rechtlicheWuerdigung }: GeldEinklagenFormularUserData,
) {
  if (rechtlicheWuerdigung) {
    const legalAssessmentTextsHeight = getHeightOfString(
      rechtlicheWuerdigung,
      doc,
      PDF_WIDTH_SEIZE,
    );

    addNewPageInCaseMissingVerticalSpace(doc, {
      extraYPosition: legalAssessmentTextsHeight,
    });

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

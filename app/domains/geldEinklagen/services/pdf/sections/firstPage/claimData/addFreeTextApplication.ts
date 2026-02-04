import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

export const addFreeTextApplication = (
  doc: PDFKit.PDFDocument,
  freeTextApplication: string | undefined,
  statementClaimSect: PDFKit.PDFStructureElement,
) => {
  if (!freeTextApplication) {
    return;
  }

  const totalHeightOfStrings = getHeightOfString(
    freeTextApplication,
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: totalHeightOfStrings,
  });

  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(freeTextApplication)
        .moveDown(1.5);
    }),
  );
  statementClaimSect.add(compensationSect);
};

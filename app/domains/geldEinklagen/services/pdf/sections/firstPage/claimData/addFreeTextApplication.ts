import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const addAdditionalApplicationsFreeText = (
  doc: PDFKit.PDFDocument,
  freeTextApplication: string | undefined,
  statementClaimSect: PDFKit.PDFStructureElement,
) => {
  if (!freeTextApplication) {
    return;
  }

  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(freeTextApplication, PDF_MARGIN_HORIZONTAL)
        .moveDown(1);
    }),
  );
  statementClaimSect.add(compensationSect);
};

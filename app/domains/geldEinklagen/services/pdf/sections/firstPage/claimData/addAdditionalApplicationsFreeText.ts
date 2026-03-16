import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const addAdditionalApplicationsFreeText = (
  doc: PDFKit.PDFDocument,
  weitereAntraege: string | undefined,
  additionalApplicationsSect: PDFKit.PDFStructureElement,
) => {
  if (!weitereAntraege) {
    return;
  }

  additionalApplicationsSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(10).font(FONTS_BUNDESSANS_BOLD).text("Weitere Anträge:");
    }),
  );

  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(weitereAntraege, PDF_MARGIN_HORIZONTAL)
        .moveDown(1);
    }),
  );
  additionalApplicationsSect.add(compensationSect);
};

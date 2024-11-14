import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const createPageNumber = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  currentPage: number,
  totalPage: number,
) => {
  footerSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(7)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${currentPage}/${totalPage}`,
          585 - PDF_MARGIN_HORIZONTAL,
          PDF_HEIGHT_SEIZE,
          {
            align: "right",
          },
        );
    }),
  );
};

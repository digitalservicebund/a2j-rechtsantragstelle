import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

const FONT_SIZE = 7;
const FONT_HEIGHT_TO_WIDTH_RATIO = 0.6;

export const createPageNumber = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  currentPage: number,
  totalPage: number,
  prefixPageNumber?: string,
) => {
  const text = prefixPageNumber
    ? `${prefixPageNumber} ${currentPage}/${totalPage}`
    : `${currentPage}/${totalPage}`;
  const textX =
    585 -
    PDF_MARGIN_HORIZONTAL -
    (prefixPageNumber
      ? prefixPageNumber.length * FONT_SIZE * FONT_HEIGHT_TO_WIDTH_RATIO
      : 0);

  footerSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(FONT_SIZE)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(text, textX, PDF_HEIGHT_SEIZE, {
          align: "right",
          lineBreak: false,
        });
    }),
  );
};

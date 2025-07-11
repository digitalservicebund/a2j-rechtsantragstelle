import type PDFDocument from "pdfkit";
import { createPageNumber } from "~/services/pdf/footer/createPageNumber";
import { createStamp } from "~/services/pdf/footer/createStamp";

export const createFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  prefixPageNumber: string,
) => {
  const pages = doc.bufferedPageRange();

  const footerSect = doc.struct("Sect");

  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    const isLastPage = i === pages.count - 1;

    createStamp(doc, footerSect, isLastPage);
    createPageNumber(doc, footerSect, i + 1, pages.count, prefixPageNumber);
  }
  documentStruct.add(footerSect);
};

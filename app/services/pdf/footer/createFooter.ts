import type PDFDocument from "pdfkit";
import { createPageNumber } from "~/services/pdf/footer/createPageNumber";
import { createStamp } from "~/services/pdf/footer/createStamp";

export const createFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  prefixPageNumber: string,
) => {
  const pages = doc.bufferedPageRange();

  const totalPages = pages.count;

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    doc.switchToPage(pageIndex);
    const footerSect = doc.struct("Sect");

    const isLastPage = pageIndex === totalPages - 1;

    createStamp(doc, footerSect, isLastPage);
    createPageNumber(
      doc,
      footerSect,
      pageIndex + 1,
      totalPages,
      prefixPageNumber,
    );
    documentStruct.add(footerSect);
  }
};

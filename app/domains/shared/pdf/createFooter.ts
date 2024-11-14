import type PDFDocument from "pdfkit";
import { createPageNumber } from "~/services/pdf/createPageNumber";
import { createStamp } from "~/services/pdf/createStamp";

export const createFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  pageNumberPrefix: string,
) => {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    const footerSect = doc.struct("Sect");
    doc.switchToPage(i);

    createStamp(doc, footerSect);
    createPageNumber(doc, footerSect, i + 1, pages.count, pageNumberPrefix);
    documentStruct.add(footerSect);
  }
};

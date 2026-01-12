import type PDFDocument from "pdfkit";
import { createPageNumber } from "~/services/pdf/footer/createPageNumber";
import { createStamp } from "~/services/pdf/footer/createStamp";
import { type UserData } from "~/domains/userData";
import { type PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";

export const createFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: UserData,
  customFooterSection?: (
    isLastPage: boolean,
    ...args: Parameters<PDFDocumentBuilder<UserData>>
  ) => void,
  prefixPageNumber?: string,
) => {
  const pages = doc.bufferedPageRange();
  const totalPages = pages.count;

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const footerSect = doc.struct("Sect");
    doc.switchToPage(pageIndex);

    const isLastPage = pageIndex === totalPages - 1;

    createStamp(doc, footerSect, isLastPage);

    createPageNumber(
      doc,
      footerSect,
      pageIndex + 1,
      totalPages,
      prefixPageNumber,
    );

    customFooterSection?.(isLastPage, doc, footerSect, userData);
    documentStruct.add(footerSect);
  }
};

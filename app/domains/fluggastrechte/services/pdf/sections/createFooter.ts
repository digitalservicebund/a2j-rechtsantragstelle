import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { createPageNumber } from "~/services/pdf/footer/createPageNumber";
import { createStamp } from "~/services/pdf/footer/createStamp";
import { createBankInformation } from "./createBankInformation";

export const createFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const pages = doc.bufferedPageRange();
  const totalPages = pages.count;

  const footerSect = doc.struct("Sect");
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    doc.switchToPage(pageIndex);

    const isLastPage = pageIndex === totalPages - 1;

    createStamp(doc, footerSect, isLastPage);

    createPageNumber(doc, footerSect, pageIndex + 1, totalPages);

    createBankInformation(doc, footerSect, userData, isLastPage);
  }
  documentStruct.add(footerSect);
};

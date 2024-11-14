import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { createBankInformation } from "./createBankInformation";
import { createPageNumber } from "../../../../../services/pdf/createPageNumber";
import { createStamp } from "../../../../../services/pdf/createStamp";

export const createFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    const footerSect = doc.struct("Sect");
    doc.switchToPage(i);

    createStamp(doc, footerSect);
    createPageNumber(doc, footerSect, i + 1, pages.count);
    createBankInformation(doc, footerSect, userData);
    documentStruct.add(footerSect);
  }
};

import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { createBankInformation } from "./createBankInformation";
import { createPageNumber } from "./createPageNumber";
import { createStamp } from "./createStamp";

export const createPageFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const footerSect = doc.struct("Sect");
  createStamp(doc, footerSect);
  createPageNumber(doc, footerSect);
  createBankInformation(doc, footerSect, userData);
  documentStruct.add(footerSect);
};

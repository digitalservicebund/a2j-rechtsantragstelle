import type PDFDocument from "pdfkit";
import { createBankInformation } from "./createBankInformation";
import { createPageNumber } from "./createPageNumber";
import { createStamp } from "./createStamp";

export const createPageFooter = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  pageNumber: number,
) => {
  createStamp(doc, documentStruct);
  createPageNumber(doc, { pageNumber });
  createBankInformation(doc, documentStruct);
};

import type PDFDocument from "pdfkit";
import { createBankInformation } from "../createBankInformation";
import { createPageNumber } from "../createPageLine";
import { createStamp } from "../createStamp";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { FONTS_BUNDESSANS_BOLD } from "../../createPdfKitDocument";

export const createSecondPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  doc
    .fontSize(31)
    .font(FONTS_BUNDESSANS_BOLD)
    .text("Begründung", { align: "left" });
  doc.moveDown(1);
  createFactsOfCases(doc, documentStruct);

  createStamp(doc, documentStruct);
  createPageNumber(doc, { pageNumber: 2 });
  createBankInformation(doc, documentStruct);
};

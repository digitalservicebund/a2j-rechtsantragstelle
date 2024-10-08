import type PDFDocument from "pdfkit";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { FONTS_BUNDESSANS_BOLD } from "../../createPdfKitDocument";
import { createPageFooter } from "../createPageFooter";

const PAGE_NUMBER = 2;

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

  createPageFooter(doc, documentStruct, PAGE_NUMBER);
};

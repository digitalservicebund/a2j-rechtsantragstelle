import type PDFDocument from "pdfkit";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { FONTS_BUNDESSANS_BOLD } from "../../createPdfKitDocument";
import { createPageFooter } from "../createPageFooter";
import { createLastSentences } from "./createLastSentences";
import { addTable } from "./table/addTable";

export const REASON_TITLE_TEXT = "Begründung";

export const createSecondPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  doc
    .fontSize(31)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(REASON_TITLE_TEXT, { align: "left" });
  doc.moveDown(1);
  createFactsOfCases(doc, documentStruct);
  addTable(doc, documentStruct);
  doc.moveDown(2);
  createLastSentences(doc, documentStruct);
  doc.moveDown(1);

  createPageFooter(doc, documentStruct);
};

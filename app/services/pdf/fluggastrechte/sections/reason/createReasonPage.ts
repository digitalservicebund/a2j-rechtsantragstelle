import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { createCompensationAmount } from "./createCompensationAmount";
import { createLastSentences } from "./createLastSentences";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { FONTS_BUNDESSANS_BOLD } from "../../createPdfKitDocument";
import { addTable } from "./table/addTable";

export const REASON_TITLE_TEXT = "Begründung";

export const createReasonPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  doc
    .fontSize(31)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(REASON_TITLE_TEXT, { align: "left" });
  doc.moveDown(1);
  createFactsOfCases(doc, documentStruct, userData);
  addTable(doc, documentStruct);
  createLastSentences(doc, documentStruct);
  doc.moveDown(1);
  createCompensationAmount(doc);
};

import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { addNewPageInCaseMissingVerticalSpace } from "./addNewPageInCaseMissingVerticalSpace";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { FONTS_BUNDESSANS_BOLD } from "../../createPdfKitDocument";
import { createLegalAssessment } from "./legalAssessment/createLegalAssessment";

export const REASON_TITLE_TEXT = "Begründung";

export const createReasonPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  doc
    .fontSize(16)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(REASON_TITLE_TEXT, { align: "left" });
  doc.moveDown(1);
  createFactsOfCases(doc, documentStruct, userData);
  addNewPageInCaseMissingVerticalSpace(doc);
  createLegalAssessment(doc, documentStruct, userData);
};

import type PDFDocument from "pdfkit";
import { createBankInformation } from "../createBankInformation";
import { createPageLine } from "../createPageLine";
import { createStamp } from "../createStamp";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";

export const createSecondPage = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  doc
    .fontSize(31)
    .font(bundesSansWebBold)
    .text("Begründung", { align: "left" });
  doc.moveDown(1);
  createFactsOfCases(doc, bundesSansWebRegular, bundesSansWebBold);

  createStamp(doc);
  createPageLine(doc, 2);
  createBankInformation(doc);
};

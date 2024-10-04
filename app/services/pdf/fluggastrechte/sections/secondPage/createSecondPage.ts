import type PDFDocument from "pdfkit";
import { createBankInformation } from "../createBankInformation";
import { createPageLine } from "../createPageLine";
import { createStamp } from "../createStamp";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { FONTS_BUNDESSANS_BOLD } from "../../createPdfKitDocument";

export const createSecondPage = (doc: typeof PDFDocument) => {
  doc
    .fontSize(31)
    .font(FONTS_BUNDESSANS_BOLD)
    .text("Begründung", { align: "left" });
  doc.moveDown(1);
  createFactsOfCases(doc);

  createStamp(doc);
  createPageLine(doc, 2);
  createBankInformation(doc);
};

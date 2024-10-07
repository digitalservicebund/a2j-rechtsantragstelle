import type PDFDocument from "pdfkit";
import { createClaimData } from "./createClaimData";
import { createLocalCourt } from "./createLocalCourt";
import { createMainTitle } from "./createMainTitle";
import { createStatementClaim } from "./createStatementClaim";
import { createBankInformation } from "../createBankInformation";
import { createPageNumber } from "../createPageLine";
import { createStamp } from "../createStamp";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  createLocalCourt(doc, documentStruct);
  doc.moveDown(2);
  createMainTitle(doc, documentStruct);
  doc.moveDown(2);
  createClaimData(doc, documentStruct);
  doc.moveDown(2);
  createStatementClaim(doc, documentStruct);
  createStamp(doc, documentStruct);
  createPageNumber(doc, { pageNumber: 1 });
  createBankInformation(doc, documentStruct);
};

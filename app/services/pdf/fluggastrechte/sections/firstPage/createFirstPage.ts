import type PDFDocument from "pdfkit";
import { createClaimData } from "./claimData/createClaimData";
import { createLocalCourtAndDate } from "./createLocalCourtAndDate";
import { createMainTitle } from "./createMainTitle";
import { createStatementClaim } from "./createStatementClaim";
import { createPageFooter } from "../createPageFooter";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  createLocalCourtAndDate(doc, documentStruct);
  doc.moveDown(2);
  createMainTitle(doc, documentStruct);
  doc.moveDown(2);
  createClaimData(doc, documentStruct);
  doc.moveDown(2);
  createStatementClaim(doc, documentStruct);
  createPageFooter(doc, documentStruct);
};

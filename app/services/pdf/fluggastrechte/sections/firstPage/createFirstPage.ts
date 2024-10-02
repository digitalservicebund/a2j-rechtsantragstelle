import type PDFDocument from "pdfkit";
import { createClaimData } from "./createClaimData";
import { createLocalCourt } from "./createLocalCourt";
import { createMainTitle } from "./createMainTitle";
import { createStatementClaim } from "./createStatementClaim";
import { createBankInformation } from "../createBankInformation";
import { createPageLine } from "../createPageLine";
import { createStamp } from "../createStamp";

export const createFirstPage = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  createLocalCourt(doc);
  doc.moveDown(2);
  createMainTitle(doc, bundesSansWebRegular, bundesSansWebBold);
  doc.moveDown(2);
  createClaimData(doc, bundesSansWebRegular, bundesSansWebBold);
  doc.moveDown(2);
  createStatementClaim(doc, bundesSansWebRegular, bundesSansWebBold);
  createStamp(doc);
  createPageLine(doc, 1);
  createBankInformation(doc);
};

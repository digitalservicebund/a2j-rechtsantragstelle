import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { createLocalCourtAndDate } from "./createLocalCourtAndDate";
import { createClaimData } from "./claimData/createClaimData";
import { createStatementClaim } from "./createStatementClaim";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  createLocalCourtAndDate(doc, documentStruct, userData);

  doc.moveDown(2);

  const moneyClaimSection = doc.struct("Sect");
  createClaimData(doc, moneyClaimSection, userData);
  documentStruct.add(moneyClaimSection);

  doc.moveDown(2);

  createStatementClaim(doc, documentStruct, userData);

  doc.moveDown(2);
};

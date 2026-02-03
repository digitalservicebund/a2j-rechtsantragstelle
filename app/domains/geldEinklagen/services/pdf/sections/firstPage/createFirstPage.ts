import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { createClaimData } from "./claimData/createClaimData";
import { createStatementClaim } from "./createStatementClaim";
import { getResponsibleCourt } from "../../../court/getResponsibleCourt";
import { createLocalCourtAndDate } from "~/domains/shared/services/pdf/createLocalCourtAndDate";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const amtsgericht = getResponsibleCourt(userData);

  createLocalCourtAndDate(doc, documentStruct, amtsgericht);

  doc.moveDown(2);

  const moneyClaimSection = doc.struct("Sect");
  createClaimData(doc, moneyClaimSection, userData);
  documentStruct.add(moneyClaimSection);

  doc.moveDown(2);

  createStatementClaim(doc, documentStruct, userData);

  doc.moveDown(2);
};

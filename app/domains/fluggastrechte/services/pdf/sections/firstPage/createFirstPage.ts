import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { createFlightCompensationClaim } from "./createFlightCompensationClaim";
import { createLocalCourtAndDate } from "./createLocalCourtAndDate";
import { createStatementClaim } from "./createStatementClaim";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  createLocalCourtAndDate(doc, documentStruct, userData);
  doc.moveDown(2);
  createFlightCompensationClaim(doc, documentStruct, userData);
  doc.moveDown(2);
  createStatementClaim(doc, documentStruct, userData);
};

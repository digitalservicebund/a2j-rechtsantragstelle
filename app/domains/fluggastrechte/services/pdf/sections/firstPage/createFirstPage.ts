import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { createFlightCompensationClaim } from "./createFlightCompensationClaim";
import { createLocalCourtAndDate } from "./createLocalCourtAndDate";
import { createStatementClaim } from "./createStatementClaim";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  createLocalCourtAndDate(doc, documentStruct, userData);
  doc.moveDown(2);
  createFlightCompensationClaim(doc, documentStruct, userData);
  doc.moveDown(2);
  createStatementClaim(doc, documentStruct, userData);
};

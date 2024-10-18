import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { createLocalCourtAndDate } from "./createLocalCourtAndDate";
import { createStatementClaim } from "./createStatementClaim";
import { createPageFooter } from "../createPageFooter";
import { createFlightCompensationClaim } from "./createFlightCompensationClaim";

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

  createPageFooter(doc, documentStruct, userData);
};

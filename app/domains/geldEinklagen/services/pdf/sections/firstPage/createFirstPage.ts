import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { createLocalCourtAndDate } from "./createLocalCourtAndDate";

export const createFirstPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  createLocalCourtAndDate(doc, documentStruct, userData);
  doc.moveDown(2);
};

import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { createChecklistDocuments } from "./createChecklistDocuments";
import { createChecklistHeader } from "./createChecklistHeader";
import { createChecklistSteps } from "./createChecklistSteps";
import { createChecklistSubmission } from "./createChecklistSubmission";

export const createChecklistPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: BeratungshilfeFormularContext,
) => {
  // Setting PDF metadata is redundant since it is overwritten during appendPagesToPdf function
  createChecklistHeader(doc, documentStruct, userData);
  doc.moveDown(2);
  createChecklistSteps(doc, documentStruct);
  createChecklistDocuments(doc, documentStruct, userData);
  doc.moveDown(1);
  createChecklistSubmission(doc, documentStruct, userData);
};

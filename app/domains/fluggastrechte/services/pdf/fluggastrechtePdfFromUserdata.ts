import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "./sections/createFooter";
import { createFirstPage } from "./sections/firstPage/createFirstPage";
import { createReasonPage } from "./sections/reason/createReasonPage";
import { setPdfMetadata } from "./setPdfMetadata";

const buildFluggastrechtePDFDocument: PDFDocumentBuilder<
  FluggastrechtContext
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc);
  createFirstPage(doc, documentStruct, userData);
  doc.addPage();
  createReasonPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export function fluggastrechtePdfFromUserdata(userData: FluggastrechtContext) {
  return pdfFromUserData(userData, buildFluggastrechtePDFDocument);
}

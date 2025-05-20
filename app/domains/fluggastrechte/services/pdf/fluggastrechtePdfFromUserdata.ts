import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "./sections/createFooter";
import { createFirstPage } from "./sections/firstPage/createFirstPage";
import { createReasonPage } from "./sections/reason/createReasonPage";
import { setPdfMetadata } from "./setPdfMetadata";

const buildFluggastrechtePDFDocument: PDFDocumentBuilder<
  FluggastrechteUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc);
  createFirstPage(doc, documentStruct, userData);
  doc.addPage();
  createReasonPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export function fluggastrechtePdfFromUserdata(
  userData: FluggastrechteUserData,
) {
  return pdfFromUserData(userData, buildFluggastrechtePDFDocument);
}

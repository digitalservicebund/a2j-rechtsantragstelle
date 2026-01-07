import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "../../../shared/services/pdf/createFooter";
import { createFirstPage } from "./sections/firstPage/createFirstPage";
import { createReasonPage } from "./sections/reason/createReasonPage";
import { setPdfMetadata } from "../../../shared/services/pdf/setPdfMetadata";
import { createBankInformation } from "~/domains/fluggastrechte/services/pdf/sections/createBankInformation";

export const TITLE = "Klage Neueingang";
export const SUBJECT = "Klageschrift";
export const KEYWORDS = "Fluggastrechte";

const buildFluggastrechtePDFDocument: PDFDocumentBuilder<
  FluggastrechteUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  createFirstPage(doc, documentStruct, userData);
  doc.addPage();
  createReasonPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData, createBankInformation);
};

export function fluggastrechtePdfFromUserdata(
  userData: FluggastrechteUserData,
) {
  return pdfFromUserData(userData, buildFluggastrechtePDFDocument);
}

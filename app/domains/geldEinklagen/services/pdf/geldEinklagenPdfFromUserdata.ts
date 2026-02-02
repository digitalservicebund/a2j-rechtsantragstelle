import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "~/services/pdf/footer/createFooter";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { createFirstPage } from "./sections/firstPage/createFirstPage";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { createBankInformation } from "./createBankInformation";

export const TITLE = "Klage Neueingang";
export const SUBJECT = "Klageschrift";
export const KEYWORDS = "Geld einklagen";

const buildGeldEinklagenPDFDocument: PDFDocumentBuilder<
  GeldEinklagenFormularUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  createFirstPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData, createBankInformation);
};

export function geldEinklagenPdfFromUserdata(
  userData: GeldEinklagenFormularUserData,
) {
  return pdfFromUserData(userData, buildGeldEinklagenPDFDocument);
}

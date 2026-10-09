import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";

const TITLE = "Klage Neueingang";
const SUBJECT = "Klageschrift";
const KEYWORDS = "Geld einklagen";

const buildGeldEinklagenAnwaltschaftPDFDocument: PDFDocumentBuilder<
  GeldEinklagenAnwaltschaftUserData
> = (doc, _documentStruct, _userData) => {
  // Keep this margin override local to TGA so body text doesn't overlap footer bank info/page numbers.
  doc.page.margins.bottom = 70;
  doc.on("pageAdded", () => {
    doc.page.margins.bottom = 70;
  });

  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  //   createFirstPage(doc, documentStruct, userData);
  //   createReasonPage(doc, documentStruct, userData);
  //   createFooter(doc, documentStruct, userData, createBankInformation);
};

export function geldEinklagenAnwaltschaftPdfFromUserdata(
  userData: GeldEinklagenAnwaltschaftUserData,
) {
  return pdfFromUserData(userData, buildGeldEinklagenAnwaltschaftPDFDocument);
}

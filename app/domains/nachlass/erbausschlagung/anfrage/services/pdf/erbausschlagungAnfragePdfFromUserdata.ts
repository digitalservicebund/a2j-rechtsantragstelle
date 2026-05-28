import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "~/services/pdf/footer/createFooter";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { type NachlassErbausschlagungAnfrageUserData } from "../../userData";
import { createHeaderAndSubject } from "./sections/headerAndSubject/createHeaderAndSubject";
import { createDeceasedPerson } from "./sections/deceasedPerson/createDeceasedPerson";
import { createRenunciantPerson } from "./sections/renunciantPerson/createRenunciantPerson";

const TITLE = "Datenblatt zur Vorbereitung einer Erbausschlagung";
const SUBJECT = "Erbausschlagung";
const KEYWORDS = "Erbausschlagung";

const buildErbausschlagungPDFDocument: PDFDocumentBuilder<
  NachlassErbausschlagungAnfrageUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  createHeaderAndSubject(doc, documentStruct, userData);
  createDeceasedPerson(doc, documentStruct, userData);
  doc.addPage();
  createRenunciantPerson(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export function erbausschlagungAnfragePdfFromUserdata(
  userData: NachlassErbausschlagungAnfrageUserData,
) {
  return pdfFromUserData(userData, buildErbausschlagungPDFDocument);
}

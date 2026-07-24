import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "~/services/pdf/footer/createFooter";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { createHeaderAndSubject } from "./sections/headerAndSubject/createHeaderAndSubject";
import { createDeceasedPerson } from "./sections/deceasedPerson/createDeceasedPerson";
import { createRenunciantPerson } from "./sections/renunciantPerson/createRenunciantPerson";
import { createChildrenOfRenunciantPerson } from "./sections/childrenOfRenunciantPerson/createChildrenOfRenunciantPerson";
import { createNoteForJudge } from "./sections/createNoteForJudge";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const TITLE = "Datenblatt zur Vorbereitung eines Erbscheinsantrags";
const SUBJECT = "Erbschein Anfrage";
const KEYWORDS = "Erbschein Anfrage";

const buildErbscheinAnfragePDFDocument: PDFDocumentBuilder<
  NachlassErbscheinAnfrageUserData
> = (doc, documentStruct, userData) => {
  doc.page.margins.bottom = 70;
  doc.on("pageAdded", () => {
    doc.page.margins.bottom = 70;
  });
  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  createHeaderAndSubject(doc, documentStruct, userData);
  createDeceasedPerson(doc, documentStruct, userData);
  doc.addPage();
  createRenunciantPerson(doc, documentStruct, userData);
  createChildrenOfRenunciantPerson(doc, documentStruct, userData);
  createNoteForJudge(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export function erbscheinAnfragePdfFromUserdata(
  userData: NachlassErbscheinAnfrageUserData,
) {
  return pdfFromUserData(userData, buildErbscheinAnfragePDFDocument);
}

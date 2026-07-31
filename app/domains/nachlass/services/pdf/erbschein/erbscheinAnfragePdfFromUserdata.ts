import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createFooter } from "~/services/pdf/footer/createFooter";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { createHeaderAndSubject } from "~/domains/nachlass/services/pdf/erbschein/sections/headerAndSubject/createHeaderAndSubject";
import { createDeceasedPerson } from "~/domains/nachlass/services/pdf/erbschein/sections/verstorbenePerson/createDeceasedPerson";
import { createAntragstellendePerson } from "~/domains/nachlass/services/pdf/erbschein/sections/antragstellendePerson/createAntragstellendePerson";
import { createTestamentOderErbvertrag } from "~/domains/nachlass/services/pdf/erbschein/sections/testamentOderErbvertrag/createTestamentOderErbvertrag";
import { createEhepartner } from "~/domains/nachlass/services/pdf/erbschein/sections/ehepartner/createEhepartner";
import { createAngehoerigeSection } from "~/domains/nachlass/services/pdf/erbschein/sections/angehoerige/createAngehoerigeSection";
import { createNachlass } from "~/domains/nachlass/services/pdf/erbschein/sections/nachlass/createNachlass";
import { createWeitereAngaben } from "~/domains/nachlass/services/pdf/erbschein/sections/abgabe/createWeitereAngaben";

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
  createAntragstellendePerson(doc, documentStruct, userData);
  createTestamentOderErbvertrag(doc, documentStruct, userData);
  if (userData.verstorbeneFamilienstand !== "ledig") {
    createEhepartner(doc, documentStruct, userData);
  }
  if (userData.testamentArt === "none") {
    createAngehoerigeSection(doc, documentStruct, userData);
  }
  createNachlass(doc, documentStruct, userData);
  if (userData.weitereAngaben) {
    createWeitereAngaben(doc, documentStruct, userData);
  }
  createFooter(doc, documentStruct, userData);
};

export function erbscheinAnfragePdfFromUserdata(
  userData: NachlassErbscheinAnfrageUserData,
) {
  return pdfFromUserData(userData, buildErbscheinAnfragePDFDocument);
}

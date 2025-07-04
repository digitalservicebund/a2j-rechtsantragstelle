import type PDFDocument from "pdfkit";

export const VERSION = 1.0;
export const TITLE = "Klage Neueingang";
export const AUTHOR = "service.justiz.de";
export const SUBJECT = "Klageschrift";
export const KEYWORDS = "Fluggastrechte";
export const CREATOR = "DigitalService GmbH des Bundes";

export const setPdfMetadata = (doc: typeof PDFDocument) => {
  doc.version = VERSION;
  doc.info.Title = TITLE;
  doc.info.Author = AUTHOR;
  doc.info.Subject = SUBJECT;
  doc.info.Keywords = KEYWORDS;
  doc.info.CreationDate = new Date(Date.now());
  doc.info.Creator = CREATOR;
};

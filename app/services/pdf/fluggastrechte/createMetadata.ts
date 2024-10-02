import type PDFDocument from "pdfkit";

export const createMetadata = (doc: typeof PDFDocument) => {
  doc.version = 1.0;
  doc.info.Title = "Klage";
  doc.info.Author = "Zugang zu Recht";
  doc.info.Subject = "Klageschrift";
  doc.info.Keywords = "Fluggastrechte";
  doc.info.CreationDate = new Date(Date.now());
  doc.info.Creator = "DigitalService GmbH des Bundes";
};

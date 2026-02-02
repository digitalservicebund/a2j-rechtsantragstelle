import type PDFDocument from "pdfkit";

export const VERSION = 1.0;
export const AUTHOR = "service.justiz.de";
export const CREATOR = "DigitalService GmbH des Bundes";

type PDFMetadata = {
  title: string;
  subject: string;
  keywords: string;
};

export const setPdfMetadata = (
  doc: typeof PDFDocument,
  metadata: PDFMetadata,
) => {
  doc.version = VERSION;
  doc.info.Title = metadata.title;
  doc.info.Author = AUTHOR;
  doc.info.Subject = metadata.subject;
  doc.info.Keywords = metadata.keywords;
  doc.info.CreationDate = new Date(Date.now());
  doc.info.Creator = CREATOR;
};

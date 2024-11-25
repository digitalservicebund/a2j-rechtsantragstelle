import type { PDFDocument } from "pdf-lib";

export type Metadata = {
  AUTHOR: string;
  CREATOR: string;
  KEYWORDS: string[];
  LANGUAGE: string;
  PRODUCER: string;
  SUBJECT: string;
  TITLE: string;
};

export function addMetadataToPdf(pdfDoc: PDFDocument, metadata: Metadata) {
  const date = new Date();

  pdfDoc.setAuthor(metadata.AUTHOR);
  pdfDoc.setCreator(metadata.CREATOR);
  pdfDoc.setKeywords(metadata.KEYWORDS);
  pdfDoc.setLanguage(metadata.LANGUAGE);
  pdfDoc.setProducer(metadata.PRODUCER);
  pdfDoc.setSubject(metadata.SUBJECT);
  pdfDoc.setTitle(metadata.TITLE);

  pdfDoc.setCreationDate(date);
  pdfDoc.setModificationDate(date);

  return pdfDoc;
}

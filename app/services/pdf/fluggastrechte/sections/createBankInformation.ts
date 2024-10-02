import type PDFDocument from "pdfkit";

export const createBankInformation = (doc: typeof PDFDocument) => {
  doc
    .fontSize(7)
    .text("Kontoinhaber: Name, Vorname | IBAN: XXXXXXXXXXXXXXXXXXXX", 70, 760);
};

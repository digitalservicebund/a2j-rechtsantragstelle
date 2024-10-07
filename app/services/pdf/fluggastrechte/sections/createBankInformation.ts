import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE, PDF_MARGIN } from "../createPdfKitDocument";

export const createBankInformation = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const bankInformationSect = doc.struct("Sect");
  bankInformationSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(7)
        .text(
          "Kontoinhaber: Name, Vorname | IBAN: XXXXXXXXXXXXXXXXXXXX",
          PDF_MARGIN,
          PDF_HEIGHT_SEIZE,
        );
    }),
  );
  documentStruct.add(bankInformationSect);
};

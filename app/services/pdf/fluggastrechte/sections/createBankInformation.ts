import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN,
} from "../createPdfKitDocument";

export const createBankInformation = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const bankInformationSect = doc.struct("Sect");
  bankInformationSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(7)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          "Kontoinhaber: Name, Vorname | IBAN: XXXXXXXXXXXXXXXXXXXX",
          PDF_MARGIN,
          PDF_HEIGHT_SEIZE,
        );
    }),
  );
  documentStruct.add(bankInformationSect);
};

import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN,
} from "../createPdfKitDocument";

export const createBankInformation = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  if (userData?.iban) {
    const bankInfo = `Kontoinhaber: ${userData.nachname}, ${userData.vorname} | IBAN: ${userData.iban}`;
    footerSect.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(7)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(bankInfo, PDF_MARGIN, PDF_HEIGHT_SEIZE);
      }),
    );
  }
};

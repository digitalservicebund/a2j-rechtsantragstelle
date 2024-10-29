import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/fluggastrechteFormular/context";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "../createPdfKitDocument";

export const createBankInformation = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const bankAccountHolder =
    userData.kontoinhaber ?? `${userData.nachname}, ${userData.vorname}`;

  if (userData?.iban) {
    const bankInfo = `Kontoinhaber: ${bankAccountHolder} | IBAN: ${userData.iban}`;
    footerSect.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(7)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(bankInfo, PDF_MARGIN_HORIZONTAL, PDF_HEIGHT_SEIZE);
      }),
    );
  }
};

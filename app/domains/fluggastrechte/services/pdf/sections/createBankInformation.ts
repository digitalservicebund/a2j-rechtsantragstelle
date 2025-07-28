import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const createBankInformation = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  { kontoinhaber, vorname, nachname, iban }: FluggastrechteUserData,
) => {
  const bankAccountHolder =
    typeof kontoinhaber !== "undefined" && kontoinhaber.trim().length > 0
      ? kontoinhaber
      : `${vorname} ${nachname}`;

  if (iban) {
    const bankInfo = `Kontoinhaber: ${bankAccountHolder} | IBAN: ${iban}`;
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

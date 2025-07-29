import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

function drawBankInfo(doc: PDFKit.PDFDocument, text: string) {
  doc
    .fontSize(7)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(text, PDF_MARGIN_HORIZONTAL, PDF_HEIGHT_SEIZE);
}

export const createBankInformation = (
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  { kontoinhaber, vorname, nachname, iban }: FluggastrechteUserData,
  isLastPage: boolean,
) => {
  const bankAccountHolder =
    typeof kontoinhaber !== "undefined" && kontoinhaber.trim().length > 0
      ? kontoinhaber
      : `${vorname} ${nachname}`;

  if (iban) {
    const bankInfo = `Kontoinhaber: ${bankAccountHolder} | IBAN: ${iban}`;

    if (isLastPage) {
      const bankInfoParagraph = doc.struct("P", {}, () => {
        drawBankInfo(doc, bankInfo);
      });
      footerSect.add(bankInfoParagraph);
    } else {
      doc.markContent("Artifact", { type: "Pagination" });
      drawBankInfo(doc, bankInfo);
      doc.endMarkedContent();
    }
  }
};

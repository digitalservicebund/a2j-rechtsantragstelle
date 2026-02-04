import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import type { GeldEinklagenFormularUserData } from "../../../formular/userData";

function drawBankInfo(doc: PDFKit.PDFDocument, text: string) {
  doc
    .fontSize(7)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(text, PDF_MARGIN_HORIZONTAL, PDF_HEIGHT_SEIZE);
}

export const createBankInformation = (
  isLastPage: boolean,
  doc: typeof PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  {
    klagendePersonKontoinhaber,
    klagendePersonVorname,
    klagendePersonNachname,
    klagendePersonIban,
  }: GeldEinklagenFormularUserData,
) => {
  const bankAccountHolder =
    klagendePersonKontoinhaber && klagendePersonKontoinhaber.trim().length > 0
      ? klagendePersonKontoinhaber
      : `${klagendePersonVorname} ${klagendePersonNachname}`;

  if (klagendePersonIban) {
    const bankInfo = `Kontoinhaber: ${bankAccountHolder} | IBAN: ${klagendePersonIban}`;

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

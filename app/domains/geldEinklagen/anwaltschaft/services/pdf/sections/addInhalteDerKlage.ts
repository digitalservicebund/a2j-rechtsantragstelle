import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { translations } from "~/services/translations/translations";

export const addInhalteDerKlage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const subjectLine = userData.zahlungsklageSubjectLine
    ? ` – ${userData.zahlungsklageSubjectLine}`
    : "";
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(`Wegen: Zahlungsklage ${subjectLine}`);
      if (userData.zahlungsklageGesamtstreitwert?.trim()) {
        doc.text(
          `Streitwert: ${userData.zahlungsklageGesamtstreitwert} ${translations.currency.euro.de}`,
        );
      } else {
        doc
          .text("Streitwert: ", { continued: true })
          .text(`${userData.zahlungsklageGesamtstreitwert}`, {
            continued: true,
          })
          .text(" Euro");
      }
    }),
  );
  doc.moveDown(2);
};

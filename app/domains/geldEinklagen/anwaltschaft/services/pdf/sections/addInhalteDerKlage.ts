import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

export const addInhalteDerKlage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          `Wegen: Zahlungsklage ${userData.zahlungsklageSubjectLine ? ` – ${userData.zahlungsklageSubjectLine}` : ""}`,
        );
      if (userData.zahlungsklageGesamtstreitwert?.trim()) {
        doc.text(`Streitwert: ${userData.zahlungsklageGesamtstreitwert} Euro`);
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

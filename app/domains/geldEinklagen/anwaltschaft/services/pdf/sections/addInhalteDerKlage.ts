import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

export const addInhalteDerKlage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const subject = userData.zahlungsklageSubjectLine?.trim();
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(`Wegen: Zahlungsklage${subject ? ` – ${subject}` : ""}`)
        .text(`Streitwert: ${userData.zahlungsklageGesamtstreitwert} Euro`);
    }),
  );
};

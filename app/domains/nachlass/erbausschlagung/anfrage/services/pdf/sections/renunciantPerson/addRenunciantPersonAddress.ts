import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const addRenunciantPersonAddress = (
  doc: typeof PDFDocument,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  doc.moveDown();

  if (userData.ausschlagendePersonZusatz) {
    doc
      .font(FONTS_BUNDESSANS_REGULAR)
      .text("Adresszusatz: ", { continued: true })
      .font(FONTS_BUNDESSANS_BOLD)
      .text(userData.ausschlagendePersonZusatz);
  }

  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Straße und Hausnummer: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(
      `${userData.ausschlagendePersonStrasse ?? ""} ${userData.ausschlagendePersonHausnummer ?? ""}`,
    )
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Postleitzahl: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(userData.ausschlagendePersonPlz ?? "")
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Ort: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(userData.ausschlagendePersonOrt ?? "")
    .moveDown();
};

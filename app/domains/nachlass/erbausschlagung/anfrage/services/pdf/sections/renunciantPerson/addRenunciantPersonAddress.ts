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
  doc
    .moveDown()
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Anschrift")
    .font(FONTS_BUNDESSANS_BOLD);

  if (userData.ausschlagendePersonZusatz) {
    doc.text(userData.ausschlagendePersonZusatz);
  }

  doc
    .text(
      `${userData.ausschlagendePersonStrasse ?? ""} ${userData.ausschlagendePersonHausnummer ?? ""}`,
    )
    .text(
      `${userData.ausschlagendePersonPlz ?? ""} ${userData.ausschlagendePersonOrt ?? ""}`,
    )
    .moveDown();
};

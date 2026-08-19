import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";

export const addRenunciantPersonDetails = (
  doc: typeof PDFDocument,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Vornamen: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(userData.ausschlagendePersonVorname ?? "")
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Nachname: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(userData.ausschlagendePersonNachname ?? "")
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Geburtsname: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(
      (userData.ausschlagendePersonGeburtsname ||
        userData.ausschlagendePersonNachname) ??
        "",
    );

  doc
    .moveDown()
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Geburtsdatum: ", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(
      userData.ausschlagendePersonGeburtsdatum
        ? toDateString(userData.ausschlagendePersonGeburtsdatum)
        : "",
    );
};

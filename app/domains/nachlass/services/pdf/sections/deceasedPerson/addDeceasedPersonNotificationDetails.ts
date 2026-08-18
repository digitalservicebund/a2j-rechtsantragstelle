import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_REGULAR,
  FONTS_BUNDESSANS_BOLD,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";

export const addDeceasedPersonNotificationDetails = (
  doc: typeof PDFDocument,
  deceasedPersonNotificationParagraph: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  deceasedPersonNotificationParagraph.add(
    doc.struct("Span", {}, () => {
      if (userData.verstorbeneNotification === "yes") {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Nachlassgericht: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(userData.nachlassgericht ?? "")
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Aktenzeichen: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(userData.aktenzeichen ?? "")
          .moveDown(1);
      } else if (userData.verstorbeneNotification === "no") {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Geburtsdatum: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.verstorbeneGeburtsdatum
              ? toDateString(userData.verstorbeneGeburtsdatum)
              : "",
          )
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Sterbedatum: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(
            userData.verstorbeneSterbedatum
              ? toDateString(userData.verstorbeneSterbedatum)
              : "",
          )
          .moveDown(1);
      }
    }),
  );
};

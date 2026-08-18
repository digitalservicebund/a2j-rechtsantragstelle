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
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Benachrichtigung: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          userData.verstorbeneNotification === "yes"
            ? "Nachlassgericht: " +
                userData.nachlassgericht +
                ", Aktenzeichen: " +
                userData.aktenzeichen
            : userData.verstorbeneNotification === "no"
              ? "Geburtsdatum: " +
                (userData.verstorbeneGeburtsdatum
                  ? toDateString(userData.verstorbeneGeburtsdatum)
                  : "") +
                ", Sterbedatum: " +
                (userData.verstorbeneSterbedatum
                  ? toDateString(userData.verstorbeneSterbedatum)
                  : "")
              : "",
        )
        .moveDown(1);
    }),
  );
};

import type PDFDocument from "pdfkit";
import { toDateString } from "~/services/validation/dateObject";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const addDeceasedPersonDetails = (
  doc: typeof PDFDocument,
  deceasedPersonParagraph: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  deceasedPersonParagraph.add(
    doc.struct("Span", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Vornamen: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.verstorbeneVorname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Nachname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(userData.verstorbeneNachname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          (userData.verstorbeneGeburtsname || userData.verstorbeneNachname) ??
            "",
        );

      doc
        .moveDown()
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
    }),
  );
};

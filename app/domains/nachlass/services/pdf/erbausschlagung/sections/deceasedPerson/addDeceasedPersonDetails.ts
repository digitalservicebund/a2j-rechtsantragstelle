import type PDFDocument from "pdfkit";
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
        )
        .moveDown(1);
    }),
  );
};

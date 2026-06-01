import type PDFDocument from "pdfkit";
import { toDateString } from "~/services/validation/dateObject";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const testamentText = (
  testament: NachlassErbausschlagungAnfrageUserData["testament"],
): string => {
  const responses: Record<string, string> = {
    none: "Nein",
    handwritten: "Ja, handschriftliches Testament",
    notarized: "Ja, notarielles Testament",
    erbvertrag: "Ja, Erbvertrag",
    unknown: "Ich weiß es nicht",
  };
  return responses[testament ?? ""] ?? "";
};

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
        );

      doc
        .moveDown()
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Testament oder Erbvertrag vorhanden: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(testamentText(userData.testament))
        .moveDown();
    }),
  );
};

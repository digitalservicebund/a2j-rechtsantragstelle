import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";
import { type NachlassErbausschlagungAnfrageKind } from "./createChildrenOfRenunciantPerson";

export const addChildOfRenunciantPersonDetails = (
  doc: typeof PDFDocument,
  childOfRenunciantPersonSection: PDFKit.PDFStructureElement,
  { vorname, nachname, geburtsdatum }: NachlassErbausschlagungAnfrageKind,
) => {
  childOfRenunciantPersonSection.add(
    doc.struct("Span", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Vornamen: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(vorname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Nachname: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(nachname ?? "")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsdatum: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(geburtsdatum ? toDateString(geburtsdatum) : "")
        .moveDown();
    }),
  );
};

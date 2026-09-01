import type PDFDocument from "pdfkit";
import { type Angehoerige } from "~/domains/nachlass/erbschein/anfrage/angehoerige/pages";
import { printRelationshipToDeceased } from "~/domains/nachlass/services/pdf/shared/printRelationshipToDeceased";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";

export const addAngehoerige = (
  doc: typeof PDFDocument,
  angehoerigeSection: PDFKit.PDFStructureElement,
  angehoerige: Angehoerige,
) => {
  angehoerigeSection.add(
    doc.struct("H3", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(14)
        .text(`${angehoerige.vorname} ${angehoerige.nachname}`)
        .fontSize(10)
        .moveDown(1);
    }),
  );

  angehoerigeSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsdatum: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(toDateString(angehoerige.geburtsdatum))
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsort: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(angehoerige.geburtsort);

      if (angehoerige.isAlive === "yes") {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Familienverhältnis zum Erblasser: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(printRelationshipToDeceased(angehoerige.verhaeltnis))
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Anschrift: ")
          .font(FONTS_BUNDESSANS_BOLD)
          .text(angehoerige.adresszusatz ?? "")
          .text(`${angehoerige.strasse} ${angehoerige.hausnummer}`)
          .text(`${angehoerige.plz} ${angehoerige.ort}`)
          .text(angehoerige.land)
          .moveDown(1);
      } else {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Sterbedatum: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(toDateString(angehoerige.sterbedatum))
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Sterbeort: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(angehoerige.sterbeort)
          .moveDown(1);
      }
    }),
  );
};

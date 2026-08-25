import type PDFDocument from "pdfkit";
import { type DescendantEntry } from "~/domains/nachlass/erbschein/shared/components/types";
import {
  type Elternteil,
  type ElternteilKind,
  type Kind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { toDateString } from "~/services/validation/dateObject";

export const addDescendant = (
  doc: typeof PDFDocument,
  angehoerigeSection: PDFKit.PDFStructureElement,
  descendant: DescendantEntry,
) => {
  const { item, relationshipToErblasser } = descendant;
  const person = item as Kind | Elternteil | ElternteilKind;
  angehoerigeSection.add(
    doc.struct("H3", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(14)
        .text(`${person.vorname} ${person.nachname}`)
        .fontSize(10)
        .moveDown(1);
    }),
  );

  angehoerigeSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Familienverhältnis zum Erblasser: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(relationshipToErblasser)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsdatum: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(toDateString(person.geburtsdatum))
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geburtsort: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(person.geburtsort);

      if (person.isAlive === "yes") {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Anschrift: ")
          .font(FONTS_BUNDESSANS_BOLD)
          .text(person.adresszusatz ?? "")
          .text(`${person.strasse} ${person.hausnummer}`)
          .text(`${person.plz} ${person.ort}`)
          .text(person.land)
          .moveDown(1);
      } else if (person.isAlive === "no") {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Sterbedatum: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(toDateString(person.sterbedatum))
          .font(FONTS_BUNDESSANS_REGULAR)
          .text("Sterbeort: ", { continued: true })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(person.sterbeort)
          .moveDown(1);
      }
    }),
  );
};

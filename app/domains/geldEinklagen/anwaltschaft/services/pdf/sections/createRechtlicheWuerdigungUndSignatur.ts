import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addMissingData } from "./addMissingData";

export const createRechtlicheWuerdigungUndSignatur = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const section = doc.struct("Sect");
  documentStruct.add(section);

  const rechtlicheWuerdigung = userData.rechtlicheWuerdigung;

  section.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("II. Rechtliche Würdigung", PDF_MARGIN_HORIZONTAL);
      doc.moveDown();
    }),
  );

  if (rechtlicheWuerdigung) {
    section.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(rechtlicheWuerdigung, PDF_MARGIN_HORIZONTAL);
        doc.moveDown(2);
      }),
    );
  }

  section.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Die Klage ist vollumfänglich begründet.", PDF_MARGIN_HORIZONTAL);
      doc.moveDown(2);
    }),
  );

  let hasSignature = false;
  for (const representative of userData.klagendeProzessbevollmaechtigte ?? []) {
    const anrede =
      representative.type === "einzelkanzlei"
        ? representative.anrede
        : undefined;
    const signatories =
      representative.type === "einzelkanzlei"
        ? [representative]
        : representative["verantwortende-personen"];
    for (const person of signatories ?? []) {
      if (!person.vorname.trim() || !person.nachname.trim()) {
        addMissingData(doc, section, "Signatur");
        hasSignature = true;
        continue;
      }
      hasSignature = true;
      section.add(
        doc.struct("P", {}, () => {
          const name = getFullPlaintiffName(
            anrede,
            person.titel,
            person.vorname,
            person.nachname,
          );
          doc
            .fontSize(10)
            .font(FONTS_BUNDESSANS_BOLD)
            .text(name, PDF_MARGIN_HORIZONTAL)
            .font(FONTS_BUNDESSANS_REGULAR);
          if (person.berufsbezeichnung) {
            doc.text(`(${person.berufsbezeichnung})`, PDF_MARGIN_HORIZONTAL);
          }
          doc.moveDown();
        }),
      );
    }
  }
  if (!hasSignature) {
    addMissingData(doc, section, "Signatur");
  }
};

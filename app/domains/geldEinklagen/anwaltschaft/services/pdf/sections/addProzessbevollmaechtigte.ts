import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import type { KlageParteiVerhaeltnis } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const formatAddress = (
  strasse: string,
  hausnummer: string,
  plz: string,
  ort: string,
  land: string,
) => {
  const streetAndNumber = [strasse, hausnummer].filter(Boolean).join(" ");
  const postalAddress = [plz, ort].filter(Boolean).join(" ");

  return [streetAndNumber, postalAddress, land].filter(Boolean).join(", ");
};

export const addProzessbevollmaechtigte = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
  relationship: KlageParteiVerhaeltnis,
) => {
  const representatives =
    (relationship === "klagende"
      ? userData.klagendeProzessbevollmaechtigte
      : userData.beklagteProzessbevollmaechtigte) ?? [];

  representatives.forEach((representative) => {
    const paragraph = doc.struct("P", {}, () => {
      const legalType =
        representative.type === "einzelkanzlei"
          ? "Einzelkanzlei"
          : "Berufsausübungsgesellschaft";

      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`Prozessbevollmächtigte ${legalType}:`);
      if (relationship === "beklagte") {
        const persons =
          representative.type === "einzelkanzlei"
            ? [representative]
            : "prozessbevollmaechtigte-personen" in representative
              ? representative["prozessbevollmaechtigte-personen"]
              : [];
        for (const person of persons) {
          doc
            .font(FONTS_BUNDESSANS_BOLD)
            .text(
              getFullPlaintiffName(
                person.anrede,
                person.titel,
                person.vorname,
                person.nachname,
              ),
            );
        }
      }
      if (representative.name) {
        doc.font(FONTS_BUNDESSANS_BOLD).text(representative.name);
      }
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          formatAddress(
            representative.strasse,
            representative.hausnummer,
            representative.plz,
            representative.ort,
            representative.land,
          ),
        );

      const contactDetails = [
        representative.telefonnummer,
        representative.email,
      ]
        .filter(Boolean)
        .join(" | ");
      if (contactDetails) doc.text(contactDetails);

      if (representative.geschaeftszeichen) {
        doc.text(`Geschäftszeichen: ${representative.geschaeftszeichen}`);
      }

      doc.moveDown(0.5);
    });
    documentStruct.add(paragraph);
  });
};

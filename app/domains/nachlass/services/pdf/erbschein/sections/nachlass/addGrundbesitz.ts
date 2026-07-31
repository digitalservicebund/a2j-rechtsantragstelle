import type PDFDocument from "pdfkit";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const addGrundbesitz = (
  doc: typeof PDFDocument,
  grundbesitzSection: PDFKit.PDFStructureElement,
  userData: NachlassErbscheinAnfrageUserData,
  index: number,
) => {
  const grundbesitz = userData.grundbesitz![index];
  grundbesitzSection.add(
    doc.struct("H3", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(14)
        .text(`Grundbesitz ${index + 1}`)
        .fontSize(10)
        .moveDown(1);
    }),
  );

  grundbesitzSection.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD);
      if (grundbesitz.adresszusatz) {
        doc.text(grundbesitz.adresszusatz);
      }
      doc
        .text(`${grundbesitz.strasse} ${grundbesitz.hausnummer}`)
        .text(`${grundbesitz.plz} ${grundbesitz.ort}`)
        .text(
          userData.verstorbeneLebensmittelpunkt === "deutschland"
            ? "Deutschland"
            : (userData.verstorbenePersonLand ?? ""),
        )
        .moveDown(1);
    }),
  );
};

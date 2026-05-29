import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type NachlassErbausschlagungAnfrageKind } from "./createChildrenOfRenunciantPerson";

const LIVE_SAME_PLACE_RENUNCIANT_PERSON_TEXT =
  "Wohnt zusammen mit der ausschlagenden Person";

export const addChildOfRenunciantPersonAddress = (
  doc: typeof PDFDocument,
  childOfRenunciantPersonSection: PDFKit.PDFStructureElement,
  {
    adresseZusatz,
    strasse,
    hausnummer,
    plz,
    ort,
    wohnortBeiAntragsteller,
  }: NachlassErbausschlagungAnfrageKind,
) => {
  childOfRenunciantPersonSection.add(
    doc.struct("Span", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Anschrift:")
        .font(FONTS_BUNDESSANS_BOLD);

      if (wohnortBeiAntragsteller === "yes") {
        doc.text(LIVE_SAME_PLACE_RENUNCIANT_PERSON_TEXT).moveDown();
        return;
      }

      if (adresseZusatz) {
        doc.text(adresseZusatz);
      }

      doc
        .text(`${strasse ?? ""} ${hausnummer ?? ""}`)
        .text(`${plz ?? ""} ${ort ?? ""}`)
        .moveDown();
    }),
  );
};

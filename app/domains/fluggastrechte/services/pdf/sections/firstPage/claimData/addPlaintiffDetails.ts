import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";

export const PLAINTIFF_TEXT = "– Klagende Partei –";
export const SEPARATOR = " | ";

export const addPlaintiffDetails = (
  doc: typeof PDFDocument,
  {
    anrede,
    title,
    vorname,
    nachname,
    strasseHausnummer,
    telefonnummer,
    plz,
    ort,
    land,
  }: FluggastrechtContext,
) => {
  const plaintiffName = getFullPlaintiffName(anrede, title, vorname, nachname);
  const address = strasseHausnummer ?? "";
  const phoneNumber = telefonnummer ?? "";
  const zipCode = plz ?? "";
  const city = ort ?? "";
  const country = land ?? "";

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(plaintiffName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${address}, ${zipCode} ${city}, ${country}`)
    .text(phoneNumber)
    .text(PLAINTIFF_TEXT, { align: "left" });
};

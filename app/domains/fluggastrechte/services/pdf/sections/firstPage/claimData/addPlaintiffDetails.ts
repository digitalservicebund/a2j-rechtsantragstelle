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
  userData: FluggastrechtContext,
) => {
  const plaintiffName = getFullPlaintiffName(userData);
  const address = userData.strasseHausnummer ?? "";
  const phoneNumber = userData.telefonnummer ?? "";
  const zipCode = userData.plz ?? "";
  const city = userData.ort ?? "";

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(plaintiffName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${address} ${zipCode} ${city}`)
    .text(phoneNumber)
    .text(PLAINTIFF_TEXT, { align: "left" });
};

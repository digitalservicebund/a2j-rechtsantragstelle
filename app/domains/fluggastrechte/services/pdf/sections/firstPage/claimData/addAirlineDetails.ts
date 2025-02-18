import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getAirlineNameByIataCode } from "~/domains/fluggastrechte/services/airlines/getAirlineNameByIataCode";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { SEPARATOR } from "./addPlaintiffDetails";

export const addAirlineDetails = (
  doc: typeof PDFDocument,
  {
    fluggesellschaft,
    fluggesellschaftStrasseHausnummer,
    fluggesellschaftPostleitzahl,
    fluggesellschaftOrt,
    fluggesellschaftLand,
  }: FluggastrechtContext,
) => {
  const airlineName = getAirlineNameByIataCode(fluggesellschaft);
  const address = fluggesellschaftStrasseHausnummer ?? "";
  const zipCode = fluggesellschaftPostleitzahl ?? "";
  const city = fluggesellschaftOrt ?? "";
  const country = fluggesellschaftLand ?? "";
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(airlineName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${address}, ${zipCode} ${city}, ${country}`)
    .text("– Beklagte Partei –");
};

import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/fluggastrechteFormular/context";
import { getAirlineNameByIataCode } from "~/services/airlines/getAirlineNameByIataCode";
import { SEPARATOR } from "./addPlaintiffDetails";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

export const addAirlineDetails = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
) => {
  const airlineName = getAirlineNameByIataCode(userData.fluggesellschaft);
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(airlineName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text("Venloer Straße 151-153, 50672 Köln")
    .text("– Beklagte Partei –");
};

import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getAirlineNameByIataCode } from "~/domains/fluggastrechte/services/airlines/getAirlineNameByIataCode";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { SEPARATOR } from "./addPlaintiffDetails";
import { getAirlineAddress } from "~/domains/fluggastrechte/formular/services/getAirlineAddress";

export const addAirlineDetails = (
  doc: typeof PDFDocument,
  context: FluggastrechteUserData,
) => {
  const airlineName = getAirlineNameByIataCode(context.fluggesellschaft);
  const { streetAndNumber, city, country, zipCode } =
    getAirlineAddress(context);

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(airlineName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${streetAndNumber}, ${zipCode} ${city}, ${country}`)
    .text("– Beklagte Partei –");
};

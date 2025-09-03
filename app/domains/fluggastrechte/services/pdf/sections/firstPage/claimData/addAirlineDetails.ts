import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getAirlineByIataCode } from "~/domains/fluggastrechte/services/airlines/getAirlineByIataCode";
import { getAirlineNameByIataCode } from "~/domains/fluggastrechte/services/airlines/getAirlineNameByIataCode";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { SEPARATOR } from "./addPlaintiffDetails";

const getAirlineAddress = ({
  fluggesellschaftAuswahlAddress,
  fluggesellschaft,
  fluggesellschaftStrasseHausnummer,
  fluggesellschaftPostleitzahl,
  fluggesellschaftOrt,
  fluggesellschaftLand,
}: FluggastrechteUserData) => {
  if (fluggesellschaftAuswahlAddress === "fromAirlineDB") {
    const airline = getAirlineByIataCode(fluggesellschaft);
    return {
      address: airline?.streetAndNumber ?? "",
      zipCode: airline?.postalCode ?? "",
      city: airline?.city ?? "",
      country: airline?.country ?? "",
    };
  }

  return {
    address: fluggesellschaftStrasseHausnummer ?? "",
    zipCode: fluggesellschaftPostleitzahl ?? "",
    city: fluggesellschaftOrt ?? "",
    country: fluggesellschaftLand ?? "",
  };
};

export const addAirlineDetails = (
  doc: typeof PDFDocument,
  context: FluggastrechteUserData,
) => {
  const airlineName = getAirlineNameByIataCode(context.fluggesellschaft);
  const { address, city, country, zipCode } = getAirlineAddress(context);

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(airlineName, { continued: true })
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(SEPARATOR, { continued: true })
    .text(`${address}, ${zipCode} ${city}, ${country}`)
    .text("– Beklagte Partei –");
};

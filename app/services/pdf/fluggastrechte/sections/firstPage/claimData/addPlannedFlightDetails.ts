import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/fluggastrechteFormular/context";
import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

export const DUE_REASON_TEXT =
  "Wegen: Ausgleichszahlung nach der Fluggastrechteverordnung (EG) 261/2004";

export const AFFECTED_FLIGHT_TEXT = "Betroffener Flug:";
export const FLIGHT_NUMBER_TEXT = "Flugnummer:";
export const PLANNED_DEPARTURE_DATE_TEXT = "Geplantes Abflugdatum:";

export const addPlannedFlightDetails = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
) => {
  const { startAirport, endAirport } = userData;
  const compensationByDistance = getCompensationPayment({
    startAirport,
    endAirport,
  });
  doc.fontSize(12).font(FONTS_BUNDESSANS_BOLD).text(DUE_REASON_TEXT);
  doc.font(FONTS_BUNDESSANS_BOLD).text(AFFECTED_FLIGHT_TEXT);
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(FLIGHT_NUMBER_TEXT, { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(` ${userData?.direktFlugnummer ?? ""}`);
  doc.moveDown(0.2);
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(PLANNED_DEPARTURE_DATE_TEXT, { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(` ${userData?.direktAbflugsDatum ?? ""}`);
  doc.moveDown(0.2);
  doc
    .fontSize(12)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(`Streitwert: ${compensationByDistance}€`);
};

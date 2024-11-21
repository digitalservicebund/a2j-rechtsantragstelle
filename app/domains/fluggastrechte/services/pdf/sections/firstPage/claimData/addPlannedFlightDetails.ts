import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const DUE_REASON_TEXT =
  "Wegen: Ausgleichszahlung nach der Fluggastrechteverordnung (EG) 261/2004";

export const AFFECTED_FLIGHT_TEXT = "Betroffener Flug:";
export const FLIGHT_NUMBER_TEXT = "Flugnummer:";
export const PLANNED_DEPARTURE_DATE_TEXT = "Geplantes Abflugdatum:";

export const addPlannedFlightDetails = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
) => {
  const compensationByDistance = getTotalCompensationClaim(userData);
  doc
    .fontSize(12)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(DUE_REASON_TEXT)
    .moveDown(0.5)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(AFFECTED_FLIGHT_TEXT)
    .fontSize(10)
    .moveDown(0.2)
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

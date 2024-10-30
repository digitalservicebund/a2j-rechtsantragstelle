import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "../../../createPdfKitDocument";

export const CONFIRM_BOOKING_TEXT = "Eine bestätigte Buchung liegt vor.";
export const ATTACHMENT_CONFIRM_BOOKING_TEXT =
  "Beweis: Anlage Buchungsbestätigung";
export const PLAINTIFF_ON_TIME_TEXT =
  "Die klagende Partei war pünktlich zum Check-in.";
export const MARGIN_RIGHT = 10;

const getFlightTextByBereich = ({
  bereich,
  startAirport,
  endAirport,
}: FluggastrechtContext) => {
  if (bereich === "verspaetet") {
    return `Der Flug von ${getAirportNameByIataCode(startAirport)} nach ${getAirportNameByIataCode(endAirport)} hatte die genannte Verspätung. Aufgrund der Verspätung wurde der Anschlussflug verpasst.`;
  }

  if (bereich === "annullierung") {
    return `Der Flug von ${getAirportNameByIataCode(startAirport)} nach ${getAirportNameByIataCode(endAirport)} wurde annulliert. Aufgrund der Annullierung wurde der Anschlussflug verpasst.`;
  }

  return `Die Nicht-Beförderung fand auf dem Flug von ${getAirportNameByIataCode(startAirport)} nach ${getAirportNameByIataCode(endAirport)} statt. Aufgrund der Nicht-Beförderung wurde der Anschlussflug verpasst.`;
};

export const addDetailedReason = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const detailedReasonSect = doc.struct("Sect");
  detailedReasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(CONFIRM_BOOKING_TEXT, PDF_MARGIN_HORIZONTAL)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          ATTACHMENT_CONFIRM_BOOKING_TEXT,
          PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
        )
        .moveDown(1);

      if (userData.bereich !== "annullierung") {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(PLAINTIFF_ON_TIME_TEXT, PDF_MARGIN_HORIZONTAL);
      }

      doc.text(getFlightTextByBereich(userData), PDF_MARGIN_HORIZONTAL);
    }),
  );
  documentStruct.add(detailedReasonSect);
};
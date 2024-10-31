import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/fluggastrechte/createPdfKitDocument";

export const BOOKING_NUMBER_TEXT = "Buchungsnummer: ";
export const FLIGHT_NUMBER_TEXT = "Flugnummer: ";
export const PLANNED_DEPARTURE_DATE_TEXT = "Geplantes Abflugdatum: ";
export const START_AIRPORT_TEXT = "Startflughafen: ";
export const END_AIRPORT_TEXT = "Zielflughafen: ";
export const FIRST_AIRPORT_STOP_TEXT = "Zwischenstopp 1: ";
export const SECOND_AIRPORT_STOP_TEXT = "Zwischenstopp 2: ";
export const THIRD_AIRPORT_STOP_TEXT = "Zwischenstopp 3: ";
export const MARGIN_RIGHT = 10;

type FlightDetail = {
  text: string;
  value: string;
};

const addZwischenstoppToFlightDetails = (
  flightDetails: FlightDetail[],
  userData: FluggastrechtContext,
) => {
  if (typeof userData.ersterZwischenstopp !== "undefined") {
    flightDetails.push({
      text: FIRST_AIRPORT_STOP_TEXT,
      value: getAirportNameByIataCode(userData.ersterZwischenstopp),
    });
  }

  if (typeof userData.zweiterZwischenstopp !== "undefined") {
    flightDetails.push({
      text: SECOND_AIRPORT_STOP_TEXT,
      value: getAirportNameByIataCode(userData.zweiterZwischenstopp),
    });
  }

  if (typeof userData.dritterZwischenstopp !== "undefined") {
    flightDetails.push({
      text: THIRD_AIRPORT_STOP_TEXT,
      value: getAirportNameByIataCode(userData.dritterZwischenstopp),
    });
  }
};

const getFlightDetails = (userData: FluggastrechtContext): FlightDetail[] => {
  const flightDetails: FlightDetail[] = [];

  flightDetails.push({
    text: BOOKING_NUMBER_TEXT,
    value: userData.buchungsNummer ?? "",
  });

  flightDetails.push({
    text: FLIGHT_NUMBER_TEXT,
    value: userData.direktFlugnummer ?? "",
  });

  flightDetails.push({
    text: PLANNED_DEPARTURE_DATE_TEXT,
    value: userData.direktAbflugsDatum ?? "",
  });

  flightDetails.push({
    text: START_AIRPORT_TEXT,
    value: getAirportNameByIataCode(userData.startAirport),
  });

  addZwischenstoppToFlightDetails(flightDetails, userData);

  flightDetails.push({
    text: END_AIRPORT_TEXT,
    value: getAirportNameByIataCode(userData.endAirport),
  });

  return flightDetails;
};

export const addFlightDetails = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const originalFlightDetailsSect = doc.struct("Sect");
  const flightDetails = getFlightDetails(userData);
  originalFlightDetailsSect.add(
    doc.struct("P", {}, () => {
      flightDetails.forEach((flightDetail) => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(
            flightDetail.text,
            PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
            undefined,
            {
              continued: true,
            },
          )
          .font(FONTS_BUNDESSANS_BOLD)
          .text(flightDetail.value);

        doc.moveDown(0.5);
      });
    }),
  );
  documentStruct.add(originalFlightDetailsSect);
};

import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const BOOKING_NUMBER_TEXT = "Buchungsnummer: ";
export const FLIGHT_NUMBER_TEXT = "Flugnummer: ";
export const PLANNED_DEPARTURE_DATE_TEXT = "Geplantes Abflugdatum: ";
export const START_AIRPORT_TEXT = "Startflughafen: ";
export const END_AIRPORT_TEXT = "Zielflughafen: ";
export const FIRST_AIRPORT_STOP_TEXT = "Zwischenstopp 1: ";
export const SECOND_AIRPORT_STOP_TEXT = "Zwischenstopp 2: ";
export const THIRD_AIRPORT_STOP_TEXT = "Zwischenstopp 3: ";

type FlightDetail = {
  text: string;
  value: string;
};

const addZwischenstoppToFlightDetails = (
  flightDetails: FlightDetail[],
  userData: FluggastrechteUserData,
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

const getFlightDetails = (userData: FluggastrechteUserData): FlightDetail[] => {
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
  reasonAndFlightDetailsList: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const flightDetails = getFlightDetails(userData);
  flightDetails.forEach((flightDetail) => {
    const originalFlightDetailsListItem = doc.struct("LI");
    originalFlightDetailsListItem.add(
      doc.struct("LBody", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(flightDetail.text, {
            continued: true,
          })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(flightDetail.value);

        doc.moveDown(0.5);
      }),
    );
    reasonAndFlightDetailsList.add(originalFlightDetailsListItem);
  });
};

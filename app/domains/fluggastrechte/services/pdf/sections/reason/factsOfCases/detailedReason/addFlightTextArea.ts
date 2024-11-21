import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";

export const REASON_DELAY_FLIGHT_LOST_CONNECTION =
  "Aufgrund der Verspätung wurde der Anschlussflug verpasst.";
export const REASON_CANCEL_FLIGHT_LOST_CONNECTION =
  "Aufgrund der Annullierung wurde der Anschlussflug verpasst.";
export const REASON_NON_TRANSPORTE_FLIGHT_LOST_CONNECTION =
  "Aufgrund der Nicht-Beförderung wurde der Anschlussflug verpasst.";

const getStartAndEndAirportNames = ({
  verspaeteterFlug,
  startAirport,
  endAirport,
  ersterZwischenstopp,
  zweiterZwischenstopp,
  dritterZwischenstopp,
}: FluggastrechtContext) => {
  if (typeof verspaeteterFlug === "undefined") {
    return {
      startAirportName: "",
      endAirportName: "",
    };
  }

  const airportMapping: Record<
    Exclude<FluggastrechtContext["verspaeteterFlug"], undefined>,
    [string | undefined, string | undefined]
  > = {
    startAirportFirstZwischenstopp: [startAirport, ersterZwischenstopp],
    firstAirportSecondZwischenstopp: [
      ersterZwischenstopp,
      zweiterZwischenstopp,
    ],
    firstZwischenstoppEndAirport: [ersterZwischenstopp, endAirport],
    secondAirportThirdZwischenstopp: [
      zweiterZwischenstopp,
      dritterZwischenstopp,
    ],
    secondZwischenstoppEndAirport: [zweiterZwischenstopp, endAirport],
    thirdZwischenstoppEndAirport: [dritterZwischenstopp, endAirport],
  };

  const [start, end] = airportMapping[verspaeteterFlug];

  return {
    startAirportName: getAirportNameByIataCode(start ?? ""),
    endAirportName: getAirportNameByIataCode(end ?? ""),
  };
};

const getFlightTextByBereich = (userdata: FluggastrechtContext) => {
  const { startAirportName, endAirportName } =
    getStartAndEndAirportNames(userdata);
  const { bereich, anschlussFlugVerpasst } = userdata;

  if (bereich === "verspaetet") {
    const flightAreaText = `Der Flug von ${startAirportName} nach ${endAirportName} hatte die genannte Verspätung.`;
    if (anschlussFlugVerpasst === "yes") {
      return `${flightAreaText} ${REASON_DELAY_FLIGHT_LOST_CONNECTION}`;
    }

    return flightAreaText;
  }

  if (bereich === "annullierung") {
    const flightAreaText = `Der Flug von ${startAirportName} nach ${endAirportName} wurde annulliert.`;
    if (anschlussFlugVerpasst === "yes") {
      return `${flightAreaText} ${REASON_CANCEL_FLIGHT_LOST_CONNECTION}`;
    }
    return flightAreaText;
  }

  const flightAreaText = `Die Nicht-Beförderung fand auf dem Flug von ${startAirportName} nach ${endAirportName} statt.`;
  if (anschlussFlugVerpasst === "yes") {
    return `${flightAreaText} ${REASON_NON_TRANSPORTE_FLIGHT_LOST_CONNECTION}`;
  }
  return flightAreaText;
};

export const addFlightTextArea = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
) => {
  if (userData.zwischenstoppAnzahl !== "no") {
    doc.text(getFlightTextByBereich(userData), PDF_MARGIN_HORIZONTAL);
  }
};

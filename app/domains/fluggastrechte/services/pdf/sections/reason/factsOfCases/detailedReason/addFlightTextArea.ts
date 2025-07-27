import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { getStartAndEndAirportDelayNames } from "./getStartAndEndAirportDelayNames";
import { MARGIN_BETWEEN_SECTIONS } from "../../../../configurations";

export const REASON_DELAY_FLIGHT_LOST_CONNECTION =
  "Aufgrund der Verspätung wurde der Anschlussflug verpasst.";
export const REASON_CANCEL_FLIGHT_LOST_CONNECTION =
  "Aufgrund der Annullierung wurde der Anschlussflug verpasst.";
export const REASON_NON_TRANSPORTE_FLIGHT_LOST_CONNECTION =
  "Aufgrund der Nicht-Beförderung wurde der Anschlussflug verpasst.";

const getFlightTextByBereich = (userdata: FluggastrechteUserData) => {
  const { startAirportName, endAirportName } =
    getStartAndEndAirportDelayNames(userdata);
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
  userData: FluggastrechteUserData,
  reasonSect: PDFKit.PDFStructureElement,
) => {
  if (userData.zwischenstoppAnzahl !== "no") {
    reasonSect.add(
      doc.struct("P", {}, () => {
        doc.text(getFlightTextByBereich(userData), PDF_MARGIN_HORIZONTAL);
        doc.moveDown(MARGIN_BETWEEN_SECTIONS);
      }),
    );
  }
};

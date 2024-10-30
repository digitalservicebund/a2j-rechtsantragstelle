import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/fluggastrechte/createPdfKitDocument";
import { COLUMN_HEIGHT, START_TABLE_Y } from "./table/tableConfigurations";

const TABLE_Y_POSITION = START_TABLE_Y + COLUMN_HEIGHT * 4 + 10;
export const COMPENSATION_PAYMENT_TEXT =
  "gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer Frist zum Datum der Frist ein. Die beklagte Partei hat jedoch bisher keine Zahlung geleistet.";
export const DEMANDED_COMPENSATION_PAYMENT_TEXT =
  "Die klagende Partei forderte außergerichtlich die Ausgleichszahlung";
export const OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT =
  "Die klagende Partei and the other passengers affected, demanded compensation payments out of court";

const getDistanceText = (startAirport: string, endAirport: string): string => {
  const distanceKmBetweenAirports =
    calculateDistanceBetweenAirportsInKilometers(startAirport, endAirport);

  const compensationAmount = getCompensationPayment({
    startAirport: startAirport,
    endAirport: endAirport,
  });

  return `Die Distanz zwischen ${getAirportNameByIataCode(startAirport)} und ${getAirportNameByIataCode(endAirport)} beträgt nach Großkreismethode ca. ${distanceKmBetweenAirports.isOk ? distanceKmBetweenAirports.value : 0}. Damit ergibt sich nach Art. 7 der Fluggastrechteverordnung (EG) 261/2004 eine Entschädigung in Höhe von ${compensationAmount} €.`;
};

const addOtherDetailsItinerary = (
  doc: typeof PDFDocument,
  zusaetzlicheAngaben?: string,
) => {
  if (
    typeof zusaetzlicheAngaben !== "undefined" &&
    zusaetzlicheAngaben.length > 0
  ) {
    doc.text(
      "Weitere Angaben zum Reiseverlauf:",
      PDF_MARGIN_HORIZONTAL,
      TABLE_Y_POSITION, // start to print this text from this line
    );

    doc
      .text(zusaetzlicheAngaben.substring(0, 250), PDF_MARGIN_HORIZONTAL, doc.y)
      .moveDown(1);
  }
};

const getYPositionDistanceText = (
  doc: typeof PDFDocument,
  zusaetzlicheAngaben?: string,
): number => {
  return typeof zusaetzlicheAngaben !== "undefined" &&
    zusaetzlicheAngaben.length > 0
    ? doc.y
    : TABLE_Y_POSITION;
};

export const addCompensationAmount = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  {
    zusaetzlicheAngaben,
    startAirport,
    endAirport,
    isWeiterePersonen,
  }: FluggastrechtContext,
) => {
  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);

      addOtherDetailsItinerary(doc, zusaetzlicheAngaben);

      doc.text(
        getDistanceText(startAirport, endAirport),
        PDF_MARGIN_HORIZONTAL,
        getYPositionDistanceText(doc, zusaetzlicheAngaben),
      );

      doc.moveDown(1);

      doc.text(
        `${isWeiterePersonen === "no" ? DEMANDED_COMPENSATION_PAYMENT_TEXT : OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT} ${COMPENSATION_PAYMENT_TEXT}`,
      );
    }),
  );
  documentStruct.add(compensationSect);
};

import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "../../../createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";

const COMPENSATION_PAYMENT_TEXT =
  "gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer Frist zum Datum der Frist ein. Die beklagte Partei hat jedoch bisher keine Zahlung geleistet.";
export const DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei forderte außergerichtlich die Ausgleichszahlung ${COMPENSATION_PAYMENT_TEXT}`;
export const OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei and the other passengers affected, demanded compensation payments out of court ${COMPENSATION_PAYMENT_TEXT}`;
export const OTHER_DETAILS_ITINERARY = "Weitere Angaben zum Reiseverlauf:";
export const ARTICLE_AIR_PASSENGER_REGULATION_TEXT =
  "Damit ergibt sich nach Art. 7 der Fluggastrechteverordnung (EG) 261/2004 eine Entschädigung in Höhe von";
export const PLAINTIFF_WITNESSES_TEXT =
  "Zum Beweis dieses Sachverhalt wird die klagende Partei im Prozessverlauf bei Bedarf Zeugen benennen.";

const getDistanceText = (startAirport: string, endAirport: string): string => {
  const startAirportName = getAirportNameByIataCode(startAirport);
  const endAirportName = getAirportNameByIataCode(endAirport);

  const distanceKmBetweenAirportsResult =
    calculateDistanceBetweenAirportsInKilometers(startAirport, endAirport);

  const distanceKmBetweenAirportValue = distanceKmBetweenAirportsResult.isOk
    ? Math.round(distanceKmBetweenAirportsResult.value)
    : 0;

  const compensationAmountValue = getCompensationPayment({
    startAirport: startAirport,
    endAirport: endAirport,
  });

  return `Die Distanz zwischen ${startAirportName} und ${endAirportName} beträgt nach Großkreismethode ca. ${distanceKmBetweenAirportValue} km. ${ARTICLE_AIR_PASSENGER_REGULATION_TEXT} ${compensationAmountValue} €.`;
};

const addOtherDetailsItinerary = (
  doc: typeof PDFDocument,
  compensationStartYPosition: number,
  zusaetzlicheAngaben?: string,
) => {
  if (
    typeof zusaetzlicheAngaben !== "undefined" &&
    zusaetzlicheAngaben.length > 0
  ) {
    doc.text(
      OTHER_DETAILS_ITINERARY,
      PDF_MARGIN_HORIZONTAL,
      compensationStartYPosition, // start to print this text from this line
    );

    doc.text(zusaetzlicheAngaben).moveDown(1);
  }
};

const getYPositionDistanceText = (
  doc: typeof PDFDocument,
  compensationStartYPosition: number,
  zusaetzlicheAngaben?: string,
): number => {
  // in case exist the zusaetzlicheAngaben should start to print from the last y position of the document, otherwise from the value compensationStartYPosition
  return typeof zusaetzlicheAngaben !== "undefined" &&
    zusaetzlicheAngaben.length > 0
    ? doc.y
    : compensationStartYPosition;
};

export const addCompensationAmount = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  {
    zusaetzlicheAngaben,
    startAirport,
    endAirport,
    isWeiterePersonen,
    hasZeugen,
  }: FluggastrechtContext,
  compensationStartYPosition: number,
) => {
  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);

      addOtherDetailsItinerary(
        doc,
        compensationStartYPosition,
        zusaetzlicheAngaben,
      );

      addNewPageInCaseMissingVerticalSpace(doc);

      doc.text(
        getDistanceText(startAirport, endAirport),
        PDF_MARGIN_HORIZONTAL,
        getYPositionDistanceText(
          doc,
          compensationStartYPosition,
          zusaetzlicheAngaben,
        ),
      );

      doc.moveDown(1);

      addNewPageInCaseMissingVerticalSpace(doc);

      doc
        .text(
          `${isWeiterePersonen === "no" ? DEMANDED_COMPENSATION_PAYMENT_TEXT : OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT}`,
        )
        .moveDown(1);

      if (hasZeugen === "yes") {
        addNewPageInCaseMissingVerticalSpace(doc);
        doc.text(PLAINTIFF_WITNESSES_TEXT).moveDown(1);
      }
    }),
  );
  documentStruct.add(compensationSect);
};

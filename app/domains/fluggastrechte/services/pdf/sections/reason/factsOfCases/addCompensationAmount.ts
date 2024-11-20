import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { addMultiplePersonsInfo } from "./addMultiplePersonsInfo";

const COMPENSATION_PAYMENT_TEXT =
  "gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer Frist zum Datum der Frist ein. Die beklagte Partei hat jedoch bisher keine Zahlung geleistet.";
export const DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei forderte außergerichtlich die Ausgleichszahlung ${COMPENSATION_PAYMENT_TEXT}`;
export const OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT = `Die klagende Partei sowie die weiteren betroffenen Fluggäste, forderten außergerichtlich die Ausgleichszahlungen ${COMPENSATION_PAYMENT_TEXT}`;
export const OTHER_DETAILS_ITINERARY = "Weitere Angaben zum Reiseverlauf:";
export const ARTICLE_AIR_PASSENGER_REGULATION_TEXT =
  "Damit ergibt sich nach Art. 7 der Fluggastrechteverordnung (EG) 261/2004 eine Entschädigung in Höhe von";
export const PLAINTIFF_WITNESSES_TEXT =
  "Zum Beweis dieses Sachverhalts wird die klagende Partei im Prozessverlauf bei Bedarf Zeugen benennen.";
export const PLAINTIFF_WITNESSES_MULTIPLE_PERSONS_TEXT =
  "Zum Beweis dieses Sachverhalts wird die klagende Partei im Prozessverlauf bei Bedarf weitere Zeugen benennen.";

const getDistanceText = (userData: FluggastrechtContext): string => {
  const startAirportName = getAirportNameByIataCode(userData.startAirport);
  const endAirportName = getAirportNameByIataCode(userData.endAirport);

  const distanceKmBetweenAirportsResult =
    calculateDistanceBetweenAirportsInKilometers(
      userData.startAirport,
      userData.endAirport,
    );

  const distanceKmBetweenAirportValue = distanceKmBetweenAirportsResult.isOk
    ? Math.round(distanceKmBetweenAirportsResult.value)
    : 0;

  const compensationAmountValue = getCompensationPayment({
    startAirport: userData.startAirport,
    endAirport: userData.endAirport,
  });

  const compensationTotalAmountValue = getTotalCompensationClaim(userData);

  const distanceText = `Die Distanz zwischen ${startAirportName} und ${endAirportName} beträgt nach Großkreismethode ca. ${distanceKmBetweenAirportValue} km. ${ARTICLE_AIR_PASSENGER_REGULATION_TEXT} ${compensationAmountValue} €`;
  if (userData.isWeiterePersonen === "no") {
    return `${distanceText}.`;
  }
  return `${distanceText} pro Person, insgesamt aus eigenem und abgetretenem Recht damit eine Gesamtsumme von ${compensationTotalAmountValue} €.`;
};

// check if should use the current Y position before to use the compensation start y position
const getStartYPosition = (
  compensationStartYPosition: number,
  currentYPosition: number,
) => {
  return currentYPosition < 150 ? currentYPosition : compensationStartYPosition;
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
      getStartYPosition(compensationStartYPosition, doc.y), // start to print this text from this line
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
    : getStartYPosition(compensationStartYPosition, doc.y);
};

export const addCompensationAmount = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
  compensationStartYPosition: number,
) => {
  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);

      addNewPageInCaseMissingVerticalSpace(doc);

      addOtherDetailsItinerary(
        doc,
        compensationStartYPosition,
        userData.zusaetzlicheAngaben,
      );

      addNewPageInCaseMissingVerticalSpace(doc);

      doc.text(
        getDistanceText(userData),
        PDF_MARGIN_HORIZONTAL,
        getYPositionDistanceText(
          doc,
          compensationStartYPosition,
          userData.zusaetzlicheAngaben,
        ),
      );

      doc.moveDown(1);

      addNewPageInCaseMissingVerticalSpace(doc);

      doc
        .text(
          `${userData.isWeiterePersonen === "no" ? DEMANDED_COMPENSATION_PAYMENT_TEXT : OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT}`,
        )
        .moveDown(1);

      addMultiplePersonsInfo(doc, userData);

      if (userData.hasZeugen === "yes") {
        addNewPageInCaseMissingVerticalSpace(doc);
        doc.text(
          `${userData.isWeiterePersonen === "no" ? PLAINTIFF_WITNESSES_TEXT : PLAINTIFF_WITNESSES_MULTIPLE_PERSONS_TEXT}`,
          PDF_MARGIN_HORIZONTAL,
        );
      }

      doc.moveDown(2);
    }),
  );
  documentStruct.add(compensationSect);
};

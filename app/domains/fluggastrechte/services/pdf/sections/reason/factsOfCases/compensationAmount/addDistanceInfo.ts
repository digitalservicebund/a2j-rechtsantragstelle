import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { getStartYPosition } from "./getStartYPosition";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const ARTICLE_AIR_PASSENGER_REGULATION_TEXT =
  "Damit ergibt sich nach Art. 7 der Fluggastrechteverordnung (EG) 261/2004 eine Entschädigung in Höhe von";

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

export const addDistanceInfo = (
  doc: typeof PDFDocument,
  userData: FluggastrechtContext,
  compensationStartYPosition: number,
) => {
  addNewPageInCaseMissingVerticalSpace(doc);

  doc
    .text(
      getDistanceText(userData),
      PDF_MARGIN_HORIZONTAL,
      getYPositionDistanceText(
        doc,
        compensationStartYPosition,
        userData.zusaetzlicheAngaben,
      ),
    )
    .moveDown(1);
};

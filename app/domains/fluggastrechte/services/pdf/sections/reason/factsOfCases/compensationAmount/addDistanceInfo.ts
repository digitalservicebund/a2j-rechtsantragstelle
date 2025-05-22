import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const ARTICLE_AIR_PASSENGER_REGULATION_TEXT =
  "Damit ergibt sich nach Art. 7 der Fluggastrechteverordnung (EG) 261/2004 eine Entschädigung in Höhe von";

const getDistanceText = (userData: FluggastrechteUserData): string => {
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

export const addDistanceInfo = (
  doc: typeof PDFDocument,
  userData: FluggastrechteUserData,
) => {
  const distanceText = getDistanceText(userData);

  const distanceTextHeight = doc.heightOfString(distanceText, {
    width: PDF_WIDTH_SEIZE,
  });

  addNewPageInCaseMissingVerticalSpace(doc, distanceTextHeight);

  doc
    .text(distanceText, PDF_MARGIN_HORIZONTAL)
    .moveDown(MARGIN_BETWEEN_SECTIONS);
};

import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";
import { getHeightOfString } from "../../getHeightOfString";

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
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const distanceText = getDistanceText(userData);

  const distanceTextHeight = getHeightOfString(
    distanceText,
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: distanceTextHeight,
  });
  const distanceSect = doc.struct("Sect");
  distanceSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);
      doc.text(distanceText, PDF_MARGIN_HORIZONTAL);
    }),
  );
  documentStruct.add(distanceSect);
};

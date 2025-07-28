import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

export const AFFECTED_FLIGHT_TEXT = "Betroffener Flug:";
export const FLIGHT_NUMBER_TEXT = "Flugnummer:";
export const PLANNED_DEPARTURE_DATE_TEXT = "Geplantes Abflugdatum:";

export const addPlannedFlightDetails = (
  doc: typeof PDFDocument,
  flightCompensationClaimSect: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const compensationByDistance = getTotalCompensationClaim(userData);

  const plannedFlightDetailsList = doc.struct("L");

  const flightDetailsListItem = doc.struct("LI");

  flightDetailsListItem.add(
    doc.struct("Lbl", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(AFFECTED_FLIGHT_TEXT).fontSize(10);
      doc.moveDown(0.2);
    }),
  );

  flightDetailsListItem.add(
    doc.struct("LBody", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(FLIGHT_NUMBER_TEXT, { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(` ${userData?.direktFlugnummer ?? ""}`);
      doc.moveDown(0.2);
    }),
  );

  plannedFlightDetailsList.add(flightDetailsListItem);

  const departureDateListItem = doc.struct("LI");

  departureDateListItem.add(
    doc.struct("LBody", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(PLANNED_DEPARTURE_DATE_TEXT, { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(` ${userData?.direktAbflugsDatum ?? ""}`);
      doc.moveDown(0.2);
    }),
  );

  plannedFlightDetailsList.add(departureDateListItem);

  const compensationListItem = doc.struct("LI");
  compensationListItem.add(
    doc.struct("LBody", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(`Streitwert: ${compensationByDistance} €`);
    }),
  );

  plannedFlightDetailsList.add(compensationListItem);

  flightCompensationClaimSect.add(plannedFlightDetailsList);
};

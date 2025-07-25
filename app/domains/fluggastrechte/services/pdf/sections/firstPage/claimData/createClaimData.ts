import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { addAirlineDetails } from "./addAirlineDetails";
import { addPlaintiffDetails } from "./addPlaintiffDetails";
import { addPlannedFlightDetails } from "./addPlannedFlightDetails";

export const IN_THE_MATTER = "in der Sache";
export const AGAINST = "gegen";

const MAIN_TITLE = "Klage";
const MAIN_SUBTITLE = "Neueingang";

export const createClaimData = (
  doc: typeof PDFDocument,
  flightCompensationClaimSect: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  flightCompensationClaimSect.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(31)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(MAIN_TITLE, { align: "left" });
      doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text(MAIN_SUBTITLE);
      doc.moveDown(2);
    }),
  );

  flightCompensationClaimSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(IN_THE_MATTER);
      doc.moveDown();
    }),
  );

  flightCompensationClaimSect.add(
    doc.struct("P", {}, () => {
      addPlaintiffDetails(doc, userData);
    }),
  );

  flightCompensationClaimSect.add(
    doc.struct("P", {}, () => {
      doc
        .moveDown()
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(AGAINST, { align: "left" })
        .moveDown();
    }),
  );

  flightCompensationClaimSect.add(
    doc.struct("P", {}, () => {
      addAirlineDetails(doc, userData);
      doc.moveDown();
    }),
  );

  addPlannedFlightDetails(doc, flightCompensationClaimSect, userData);
};

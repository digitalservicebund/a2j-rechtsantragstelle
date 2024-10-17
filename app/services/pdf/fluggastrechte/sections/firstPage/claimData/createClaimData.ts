import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { addAirlineDetails } from "./addAirlineDetails";
import { addPlaintiffDetails } from "./addPlaintiffDetails";
import { addPlannedFlightDetails } from "./addPlannedFlightDetails";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

export const IN_THE_MATTER = "in der Sache";
export const AGAINST = "gegen";

export const MAIN_TITLE = "Klage";
export const MAIN_SUBTITLE = "Neueingang";

export const createClaimData = (
  doc: typeof PDFDocument,
  flightCompensationClaimSect: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
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
      doc
        .moveDown()
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(AGAINST, { align: "left" })
        .moveDown();
      addAirlineDetails(doc, userData);
      doc.moveDown();
      addPlannedFlightDetails(doc, userData);
    }),
  );
};
